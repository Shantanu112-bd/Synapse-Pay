#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, symbol_short, vec, Address, Env, IntoVal, String, Vec};

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Transaction {
    pub from: String,
    pub to: Address,
    pub amount: i128,
    pub timestamp: u64,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Wallet {
    pub owner: Address,
    pub balance: i128,
}

#[contracttype]
pub enum DataKey {
    Wallet(String),
    History(String),
    BudgetContract,
}

#[contract]
pub struct AgentWallet;

#[contractimpl]
impl AgentWallet {
    pub fn create_wallet(env: Env, agent_id: String, owner: Address) -> Address {
        owner.require_auth();
        let key = DataKey::Wallet(agent_id.clone());
        if env.storage().persistent().has(&key) {
            panic!("Wallet already exists");
        }
        let wallet = Wallet {
            owner: owner.clone(),
            balance: 0,
        };
        env.storage().persistent().set(&key, &wallet);

        let history_key = DataKey::History(agent_id);
        let history: Vec<Transaction> = Vec::new(&env);
        env.storage().persistent().set(&history_key, &history);

        owner
    }

    pub fn set_budget_contract(env: Env, budget_contract: Address) {
        // In a real app, protect this with admin auth
        env.storage().persistent().set(&DataKey::BudgetContract, &budget_contract);
    }

    pub fn fund_wallet(env: Env, agent_id: String, amount: i128) {
        if amount <= 0 {
            panic!("Amount must be positive");
        }
        let key = DataKey::Wallet(agent_id.clone());
        let mut wallet: Wallet = env.storage().persistent().get(&key).expect("Wallet not found");

        wallet.balance += amount;
        env.storage().persistent().set(&key, &wallet);

        env.events().publish((symbol_short!("Funded"), agent_id), amount);
    }

    pub fn get_balance(env: Env, agent_id: String) -> i128 {
        let key = DataKey::Wallet(agent_id);
        let wallet: Wallet = env.storage().persistent().get(&key).expect("Wallet not found");
        wallet.balance
    }

    pub fn send_payment(env: Env, from_agent: String, to_address: Address, amount: i128) -> bool {
        if amount <= 0 {
            return false;
        }
        let key = DataKey::Wallet(from_agent.clone());
        let mut wallet: Wallet = match env.storage().persistent().get(&key) {
            Some(w) => w,
            None => return false,
        };

        wallet.owner.require_auth();

        if wallet.balance < amount {
            return false;
        }

        // Budget Control Integration
        let budget_contract_key = DataKey::BudgetContract;
        if let Some(budget_contract) = env.storage().persistent().get::<_, Address>(&budget_contract_key) {
            let paused: bool = env.invoke_contract(
                &budget_contract,
                &soroban_sdk::Symbol::new(&env, "is_paused"),
                vec![&env, from_agent.clone().into_val(&env)],
            );
            if paused { return false; }

            let whitelisted: bool = env.invoke_contract(
                &budget_contract,
                &soroban_sdk::Symbol::new(&env, "check_whitelist"),
                vec![&env, from_agent.clone().into_val(&env), to_address.clone().into_val(&env)],
            );
            if !whitelisted { return false; }

            let within_budget: bool = env.invoke_contract(
                &budget_contract,
                &soroban_sdk::Symbol::new(&env, "check_budget"),
                vec![&env, from_agent.clone().into_val(&env), amount.into_val(&env)],
            );
            if !within_budget { return false; }

            let _: () = env.invoke_contract(
                &budget_contract,
                &soroban_sdk::Symbol::new(&env, "record_spend"),
                vec![&env, from_agent.clone().into_val(&env), amount.into_val(&env)],
            );
        }

        wallet.balance -= amount;
        env.storage().persistent().set(&key, &wallet);

        let history_key = DataKey::History(from_agent.clone());
        let mut history: Vec<Transaction> = env.storage()
            .persistent()
            .get(&history_key)
            .unwrap_or(Vec::new(&env));

        let tx = Transaction {
            from: from_agent.clone(),
            to: to_address.clone(),
            amount,
            timestamp: env.ledger().timestamp(),
        };

        history.push_back(tx.clone());
        env.storage().persistent().set(&history_key, &history);

        env.events().publish((symbol_short!("Payment"), from_agent), tx);

        true
    }

    pub fn get_transaction_history(env: Env, agent_id: String) -> Vec<Transaction> {
        let history_key = DataKey::History(agent_id);
        env.storage().persistent().get(&history_key).unwrap_or(Vec::new(&env))
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::{testutils::{Address as _, Ledger}, Env};

    #[test]
    fn test_wallet_flow() {
        let env = Env::default();
        let contract_id = env.register(AgentWallet, ());
        let client = AgentWalletClient::new(&env, &contract_id);

        let owner = Address::generate(&env);
        let user2 = Address::generate(&env);
        let agent_id = String::from_str(&env, "agent1");

        env.mock_all_auths();
        
        // Flow check
        client.create_wallet(&agent_id, &owner);
        client.fund_wallet(&agent_id, &1000);

        let balance = client.get_balance(&agent_id);
        assert_eq!(balance, 1000);

        env.ledger().set_timestamp(12345);
        let success = client.send_payment(&agent_id, &user2, &300);
        assert_eq!(success, true);
        
        let balance = client.get_balance(&agent_id);
        assert_eq!(balance, 700);
    }
}
