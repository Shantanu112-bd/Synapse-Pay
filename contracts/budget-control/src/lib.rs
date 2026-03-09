#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Address, Env, String, Vec};

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Budget {
    pub owner: Address,
    pub daily_limit: i128,
    pub total_limit: i128,
    pub total_spent: i128,
    pub daily_spent: i128,
    pub last_spent_day: u64,
}

#[contracttype]
pub enum DataKey {
    Budget(String),
    Whitelist(String),
    Paused(String),
}

#[contract]
pub struct BudgetControl;

#[contractimpl]
impl BudgetControl {
    pub fn set_budget_limit(env: Env, agent_id: String, owner: Address, daily_limit: i128, total_limit: i128) {
        owner.require_auth();
        let key = DataKey::Budget(agent_id.clone());
        let mut budget = env.storage().persistent().get(&key).unwrap_or(Budget {
            owner: owner.clone(),
            daily_limit: 0,
            total_limit: 0,
            total_spent: 0,
            daily_spent: 0,
            last_spent_day: env.ledger().timestamp() / 86400,
        });

        if budget.owner != owner {
            panic!("Not the owner");
        }

        budget.daily_limit = daily_limit;
        budget.total_limit = total_limit;
        env.storage().persistent().set(&key, &budget);
    }

    pub fn check_budget(env: Env, agent_id: String, amount: i128) -> bool {
        let key = DataKey::Budget(agent_id.clone());
        if let Some(budget) = env.storage().persistent().get::<_, Budget>(&key) {
            let current_day = env.ledger().timestamp() / 86400;
            let mut current_daily_spent = budget.daily_spent;
            if current_day != budget.last_spent_day {
                current_daily_spent = 0;
            }

            if budget.total_limit > 0 && budget.total_spent + amount > budget.total_limit {
                return false;
            }
            if budget.daily_limit > 0 && current_daily_spent + amount > budget.daily_limit {
                return false;
            }
            true
        } else {
            true // No limits set
        }
    }

    pub fn record_spend(env: Env, agent_id: String, amount: i128) {
        let key = DataKey::Budget(agent_id.clone());
        if let Some(mut budget) = env.storage().persistent().get::<_, Budget>(&key) {
            let current_day = env.ledger().timestamp() / 86400;
            if current_day != budget.last_spent_day {
                budget.daily_spent = 0;
                budget.last_spent_day = current_day;
            }
            budget.daily_spent += amount;
            budget.total_spent += amount;
            env.storage().persistent().set(&key, &budget);
        }
    }

    pub fn get_spending_today(env: Env, agent_id: String) -> i128 {
        let key = DataKey::Budget(agent_id.clone());
        if let Some(budget) = env.storage().persistent().get::<_, Budget>(&key) {
            let current_day = env.ledger().timestamp() / 86400;
            if current_day == budget.last_spent_day {
                budget.daily_spent
            } else {
                0
            }
        } else {
            0
        }
    }

    pub fn set_whitelist(env: Env, agent_id: String, owner: Address, allowed_addresses: Vec<Address>) {
        owner.require_auth();
        let b_key = DataKey::Budget(agent_id.clone());
        if let Some(budget) = env.storage().persistent().get::<_, Budget>(&b_key) {
            if budget.owner != owner {
                panic!("Not the owner");
            }
        } else {
            panic!("Budget not initialized");
        }

        let key = DataKey::Whitelist(agent_id);
        env.storage().persistent().set(&key, &allowed_addresses);
    }

    pub fn check_whitelist(env: Env, agent_id: String, to_address: Address) -> bool {
        let key = DataKey::Whitelist(agent_id);
        if let Some(whitelist) = env.storage().persistent().get::<_, Vec<Address>>(&key) {
            if whitelist.len() == 0 {
                return true;
            }
            whitelist.contains(&to_address)
        } else {
            true
        }
    }

    pub fn circuit_breaker(env: Env, agent_id: String, owner: Address) {
        owner.require_auth();
        let b_key = DataKey::Budget(agent_id.clone());
        if let Some(budget) = env.storage().persistent().get::<_, Budget>(&b_key) {
            if budget.owner != owner {
                panic!("Not the owner");
            }
        } else {
            panic!("Budget not initialized");
        }
        let key = DataKey::Paused(agent_id);
        env.storage().persistent().set(&key, &true);
    }

    pub fn resume_payments(env: Env, agent_id: String, owner: Address) {
        owner.require_auth();
        let b_key = DataKey::Budget(agent_id.clone());
        if let Some(budget) = env.storage().persistent().get::<_, Budget>(&b_key) {
            if budget.owner != owner {
                panic!("Not the owner");
            }
        }
        let key = DataKey::Paused(agent_id);
        env.storage().persistent().set(&key, &false);
    }

    pub fn is_paused(env: Env, agent_id: String) -> bool {
        let key = DataKey::Paused(agent_id);
        env.storage().persistent().get(&key).unwrap_or(false)
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::{testutils::{Address as _, Ledger}, Env};

    #[test]
    fn test_budget_control_flow() {
        let env = Env::default();
        let contract_id = env.register(BudgetControl, ());
        let client = BudgetControlClient::new(&env, &contract_id);

        let owner = Address::generate(&env);
        let user2 = Address::generate(&env);
        let agent_id = String::from_str(&env, "agent1");

        env.mock_all_auths();
        
        // 1. Initial Limits
        client.set_budget_limit(&agent_id, &owner, &500, &1000);
        
        // 2. Add whitelist
        let mut whitelist = Vec::new(&env);
        whitelist.push_back(user2.clone());
        client.set_whitelist(&agent_id, &owner, &whitelist);
        
        // 3. Check functions
        assert_eq!(client.check_whitelist(&agent_id, &user2), true);
        assert_eq!(client.check_budget(&agent_id, &300), true);
        
        // Exceed daily limit
        assert_eq!(client.check_budget(&agent_id, &600), false);
        
        // 4. Record a spend
        client.record_spend(&agent_id, &300);
        assert_eq!(client.get_spending_today(&agent_id), 300);
        assert_eq!(client.check_budget(&agent_id, &300), false); // 300 + 300 > 500
        
        // 5. Circuit Breaker
        assert_eq!(client.is_paused(&agent_id), false);
        client.circuit_breaker(&agent_id, &owner);
        assert_eq!(client.is_paused(&agent_id), true);
        
        // Resume
        client.resume_payments(&agent_id, &owner);
        assert_eq!(client.is_paused(&agent_id), false);
    }
}
