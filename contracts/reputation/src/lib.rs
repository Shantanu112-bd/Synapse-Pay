#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Env, String};

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct ReputationScore {
    pub total_transactions: u32,
    pub success_rate: u32, // percentage 0-100
    pub total_volume: i128,
    pub disputes_raised: u32,
    pub member_since: u64,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct ServiceScore {
    pub total_transactions: u32,
    pub success_rate: u32, // percentage 0-100
    pub total_volume: i128,
    pub total_disputes: u32,
    pub member_since: u64,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum TrustBadge {
    New,
    Rising,
    Trusted,
    Verified,
    Flagged,
}

#[contracttype]
pub enum DataKey {
    AgentScore(String),
    ServiceScore(String),
}

#[contract]
pub struct Reputation;

#[contractimpl]
impl Reputation {
    pub fn record_transaction(
        env: Env,
        agent_id: String,
        service_id: String,
        success: bool,
        amount: i128,
    ) {
        // We do not require auth here since this would ideally be called directly from escrow or wallet
        // In a real scenario, we might want only authorized contract addresses calling this

        let agent_key = DataKey::AgentScore(agent_id.clone());
        let service_key = DataKey::ServiceScore(service_id.clone());

        let timestamp = env.ledger().timestamp();

        let mut a_score = env.storage().persistent().get(&agent_key).unwrap_or(ReputationScore {
            total_transactions: 0,
            success_rate: 100,
            total_volume: 0,
            disputes_raised: 0,
            member_since: timestamp,
        });

        let mut s_score = env.storage().persistent().get(&service_key).unwrap_or(ServiceScore {
            total_transactions: 0,
            success_rate: 100,
            total_volume: 0,
            total_disputes: 0,
            member_since: timestamp,
        });

        // Update Agent
        a_score.total_transactions += 1;
        a_score.total_volume += amount;
        if !success {
            a_score.disputes_raised += 1;
        }

        let a_success_txs = a_score.total_transactions - a_score.disputes_raised;
        a_score.success_rate = (a_success_txs * 100) / a_score.total_transactions;

        env.storage().persistent().set(&agent_key, &a_score);

        // Update Service
        s_score.total_transactions += 1;
        s_score.total_volume += amount;
        if !success {
            s_score.total_disputes += 1;
        }

        let s_success_txs = s_score.total_transactions - s_score.total_disputes;
        s_score.success_rate = (s_success_txs * 100) / s_score.total_transactions;

        env.storage().persistent().set(&service_key, &s_score);
    }

    pub fn get_agent_score(env: Env, agent_id: String) -> ReputationScore {
        let key = DataKey::AgentScore(agent_id.clone());
        env.storage().persistent().get(&key).unwrap_or(ReputationScore {
            total_transactions: 0,
            success_rate: 100,
            total_volume: 0,
            disputes_raised: 0,
            member_since: env.ledger().timestamp(),
        })
    }

    pub fn get_service_score(env: Env, service_id: String) -> ServiceScore {
        let key = DataKey::ServiceScore(service_id.clone());
        env.storage().persistent().get(&key).unwrap_or(ServiceScore {
            total_transactions: 0,
            success_rate: 100,
            total_volume: 0,
            total_disputes: 0,
            member_since: env.ledger().timestamp(),
        })
    }

    pub fn get_trust_badge(env: Env, agent_id: String) -> TrustBadge {
        let key = DataKey::AgentScore(agent_id.clone());
        if let Some(score) = env.storage().persistent().get::<_, ReputationScore>(&key) {
            let dispute_rate = (score.disputes_raised * 100) / score.total_transactions.max(1);

            // Flagged check first
            if dispute_rate > 10 && score.total_transactions > 10 { // Give some leeway for the first 10
                return TrustBadge::Flagged;
            }

            if score.total_transactions >= 200 && dispute_rate < 1 {
                return TrustBadge::Verified;
            }

            if score.total_transactions >= 51 {
                return TrustBadge::Trusted;
            }

            if score.total_transactions >= 11 {
                return TrustBadge::Rising;
            }

            TrustBadge::New
        } else {
            TrustBadge::New
        }
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::Env;

    #[test]
    fn test_reputation_flow() {
        let env = Env::default();
        let contract_id = env.register(Reputation, ());
        let client = ReputationClient::new(&env, &contract_id);

        let agent = String::from_str(&env, "agent-1");
        let service = String::from_str(&env, "service-1");

        // Record a successful transaction
        client.record_transaction(&agent, &service, &true, &100);

        let a_score = client.get_agent_score(&agent);
        assert_eq!(a_score.total_transactions, 1);
        assert_eq!(a_score.total_volume, 100);
        assert_eq!(a_score.success_rate, 100);
        assert_eq!(a_score.disputes_raised, 0);

        let s_score = client.get_service_score(&service);
        assert_eq!(s_score.total_transactions, 1);
        assert_eq!(s_score.total_volume, 100);
        assert_eq!(s_score.success_rate, 100);

        // Record a dispute
        client.record_transaction(&agent, &service, &false, &50);

        let a_score = client.get_agent_score(&agent);
        assert_eq!(a_score.total_transactions, 2);
        assert_eq!(a_score.total_volume, 150);
        // 1 success out of 2 = 50%
        assert_eq!(a_score.success_rate, 50);
        assert_eq!(a_score.disputes_raised, 1);

        // Check badge for New (2 transactions)
        assert_eq!(client.get_trust_badge(&agent), TrustBadge::New);

        // Push it into Flagged (> 10 tx, > 10% disputes)
        for _ in 0..10 {
            client.record_transaction(&agent, &service, &true, &10); // success
        }
        client.record_transaction(&agent, &service, &false, &10); // dispute
        // Total Tx: 13, Disputes: 2. Rate = ~15% > 10%. Threshold past 10 tx hit.
        assert_eq!(client.get_trust_badge(&agent), TrustBadge::Flagged);

        // Test Trusted Flow (diff agent)
        let agent2 = String::from_str(&env, "agent-2");
        for _ in 0..55 {
            client.record_transaction(&agent2, &service, &true, &10); // success
        }
        assert_eq!(client.get_trust_badge(&agent2), TrustBadge::Trusted);
    }
}
