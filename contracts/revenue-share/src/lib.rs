#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, symbol_short, vec, Address, Env, IntoVal, String, Vec};

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct SplitRecord {
    pub split_id: String,
    pub master_agent: String,
    pub worker_agents: Vec<String>,
    pub split_percentages: Vec<u32>,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct SplitExecutionEvent {
    pub split_id: String,
    pub total_amount: i128,
}

#[contracttype]
pub enum DataKey {
    Split(String),
    AgentHistory(String),
    WalletContract,
    Nonce,
}

#[contract]
pub struct RevenueShare;

fn generate_split_id(env: &Env) -> String {
    let mut nonce: u64 = env.storage().persistent().get(&DataKey::Nonce).unwrap_or(0);
    nonce += 1;
    env.storage().persistent().set(&DataKey::Nonce, &nonce);
    
    let mut buf = [0u8; 32];
    let prefix = b"split-";
    for i in 0..prefix.len() {
        buf[i] = prefix[i];
    }
    let mut n = nonce;
    let mut digits = [0u8; 20];
    let mut d_len = 0;
    if n == 0 {
        digits[0] = b'0';
        d_len = 1;
    } else {
        while n > 0 {
            digits[d_len] = (n % 10) as u8 + b'0';
            n /= 10;
            d_len += 1;
        }
    }
    let offset = prefix.len();
    for i in 0..d_len {
        buf[offset + i] = digits[d_len - 1 - i];
    }
    let total_len = offset + d_len;
    String::from_bytes(env, &buf[0..total_len])
}

fn add_to_history(env: &Env, agent_id: String, record: SplitRecord) {
    let key = DataKey::AgentHistory(agent_id);
    let mut history: Vec<SplitRecord> = env.storage().persistent().get(&key).unwrap_or(Vec::new(env));
    history.push_back(record);
    env.storage().persistent().set(&key, &history);
}

#[contractimpl]
impl RevenueShare {
    pub fn initialize(env: Env, wallet_contract: Address) {
        env.storage().persistent().set(&DataKey::WalletContract, &wallet_contract);
    }

    pub fn create_split(
        env: Env,
        master_agent: String,
        worker_agents: Vec<String>,
        split_percentages: Vec<u32>,
    ) -> String {
        // Validation
        if worker_agents.len() != split_percentages.len() {
            panic!("Mismatched arrays");
        }
        
        // Sometimes the master itself could be a percentage, but in the use case
        // "travel agent gets $0" we enforce worker percentages
        let mut total = 0;
        for i in 0..split_percentages.len() {
            total += split_percentages.get(i).unwrap();
        }
        
        if total != 100 {
            panic!("Percentages must sum to 100");
        }

        let split_id = generate_split_id(&env);

        let record = SplitRecord {
            split_id: split_id.clone(),
            master_agent: master_agent.clone(),
            worker_agents: worker_agents.clone(),
            split_percentages: split_percentages.clone(),
        };

        // Save Split
        env.storage().persistent().set(&DataKey::Split(split_id.clone()), &record);

        // Save to histories
        add_to_history(&env, master_agent.clone(), record.clone());
        for i in 0..worker_agents.len() {
            let worker = worker_agents.get(i).unwrap();
            add_to_history(&env, worker, record.clone());
        }

        split_id
    }

    pub fn execute_split(env: Env, split_id: String, total_amount: i128) {
        let key = DataKey::Split(split_id.clone());
        let record: SplitRecord = env.storage().persistent().get(&key).expect("Split not found");

        if let Some(wallet_contract) = env.storage().persistent().get::<_, Address>(&DataKey::WalletContract) {
            // Deduct total_amount from master agent (assumed master receives the full block first, or
            // we actively distribute from the master's accumulated budget/wallet.
            // But usually the client pays the *contract* / escrow, and then the money goes to the workers.
            // If the prompt says: "When user pays $10, ... sends correct amount to each agent wallet"
            // We'll mimic this by simply calling fund_wallet on each worker.
            // Normally we'd take payment from user -> master then split, but we'll assume the contract 
            // routes directly or the master calls this.

            for i in 0..record.worker_agents.len() {
                let worker = record.worker_agents.get(i).unwrap();
                let pct = record.split_percentages.get(i).unwrap();

                // calculate share
                let share_amount = (total_amount * (pct as i128)) / 100;
                
                if share_amount > 0 {
                    let _: () = env.invoke_contract(
                        &wallet_contract,
                        &soroban_sdk::Symbol::new(&env, "fund_wallet"),
                        vec![&env, worker.into_val(&env), share_amount.into_val(&env)],
                    );
                }
            }
        }
        
        env.events().publish((symbol_short!("SplitExec"), split_id.clone()), total_amount);
    }

    pub fn get_split_history(env: Env, agent_id: String) -> Vec<SplitRecord> {
        let key = DataKey::AgentHistory(agent_id);
        env.storage().persistent().get(&key).unwrap_or(Vec::new(&env))
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::{testutils::{Address as _, Ledger}, Env};

    // Mock wallet for testing
    #[contract]
    pub struct MockWallet;
    #[contractimpl]
    impl MockWallet {
        pub fn fund_wallet(env: Env, _agent_id: String, amount: i128) {
            // Just accept
        }
    }

    #[test]
    fn test_revenue_share_flow() {
        let env = Env::default();
        let contract_id = env.register(RevenueShare, ());
        let client = RevenueShareClient::new(&env, &contract_id);

        let wallet_id = env.register(MockWallet, ());
        client.initialize(&wallet_id);

        let master = String::from_str(&env, "master-travel");
        let worker1 = String::from_str(&env, "flights-agent");
        let worker2 = String::from_str(&env, "hotels-agent");
        let worker3 = String::from_str(&env, "transport-agent");

        let mut workers = Vec::new(&env);
        workers.push_back(worker1.clone());
        workers.push_back(worker2.clone());
        workers.push_back(worker3.clone());

        let mut percentages = Vec::new(&env);
        percentages.push_back(40); // flights
        percentages.push_back(35); // hotels
        percentages.push_back(25); // transport

        let split_id = client.create_split(&master, &workers, &percentages);

        client.execute_split(&split_id, &1000); // represents $10.00 if scale is 2 decimals

        // History Verification
        let master_history = client.get_split_history(&master);
        assert_eq!(master_history.len(), 1);
        assert_eq!(master_history.get(0).unwrap().split_id, split_id);

        let flights_history = client.get_split_history(&worker1);
        assert_eq!(flights_history.len(), 1);
        assert_eq!(flights_history.get(0).unwrap().split_id, split_id);
    }

    #[test]
    #[should_panic(expected = "Percentages must sum to 100")]
    fn test_invalid_percentages() {
        let env = Env::default();
        let contract_id = env.register(RevenueShare, ());
        let client = RevenueShareClient::new(&env, &contract_id);

        let master = String::from_str(&env, "master");
        let worker1 = String::from_str(&env, "w1");

        let mut workers = Vec::new(&env);
        workers.push_back(worker1.clone());

        let mut percentages = Vec::new(&env);
        percentages.push_back(50); // Doesn't sum to 100

        client.create_split(&master, &workers, &percentages);
    }
}
