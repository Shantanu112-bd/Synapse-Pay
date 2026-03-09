#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, symbol_short, Address, Env, String, Vec};

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum EscrowStatus {
    Pending,
    Locked,
    Released,
    Disputed,
    Refunded,
    Expired,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct EscrowRecord {
    pub id: String,
    pub payer: Address,
    pub provider: Address, // explicitly added to know where to release funds to
    pub service_id: String,
    pub amount: i128,
    pub created_at: u64,
    pub expire_at: u64,
    pub status: EscrowStatus,
    pub dispute_reason: Option<String>,
}

#[contracttype]
pub enum DataKey {
    Escrow(String),
    Nonce,
}

#[contract]
pub struct EscrowContract;

fn generate_escrow_id(env: &Env) -> String {
    let mut nonce: u64 = env.storage().persistent().get(&DataKey::Nonce).unwrap_or(0);
    nonce += 1;
    env.storage().persistent().set(&DataKey::Nonce, &nonce);
    
    let mut buf = [0u8; 32];
    let prefix = b"escrow-";
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

#[contractimpl]
impl EscrowContract {
    pub fn create_escrow(
        env: Env,
        payer: Address,
        provider: Address,
        service_id: String,
        amount: i128,
        expiry_seconds: u64,
    ) -> String {
        payer.require_auth();

        if amount <= 0 {
            panic!("Amount must be positive");
        }

        let escrow_id = generate_escrow_id(&env);
        let created_at = env.ledger().timestamp();
        let expire_at = created_at + expiry_seconds;

        let record = EscrowRecord {
            id: escrow_id.clone(),
            payer,
            provider,
            service_id,
            amount,
            created_at,
            expire_at,
            status: EscrowStatus::Locked,
            dispute_reason: None,
        };

        env.storage().persistent().set(&DataKey::Escrow(escrow_id.clone()), &record);
        
        escrow_id
    }

    pub fn release_payment(env: Env, escrow_id: String) {
        let key = DataKey::Escrow(escrow_id.clone());
        let mut record: EscrowRecord = env.storage().persistent().get(&key).expect("Escrow not found");
        
        // Payer can authoritize the release to complete early, OR Provider confirms delivery
        // For machine-to-machine, provider typically resolves and claims it, or payer releases it.
        // We'll allow the provider to claim it if we assume truthfulness, or payer to release.
        // Let's require the provider's auth to confirm delivery.
        record.provider.require_auth();

        if record.status != EscrowStatus::Locked {
            panic!("Escrow is not in locked state");
        }

        let current_time = env.ledger().timestamp();
        if current_time >= record.expire_at {
            panic!("Escrow has expired");
        }

        record.status = EscrowStatus::Released;
        env.storage().persistent().set(&key, &record);

        env.events().publish((symbol_short!("Released"), escrow_id.clone()), record.amount);
    }

    pub fn refund_payment(env: Env, escrow_id: String) {
        let key = DataKey::Escrow(escrow_id.clone());
        let mut record: EscrowRecord = env.storage().persistent().get(&key).expect("Escrow not found");

        if record.status != EscrowStatus::Locked {
            panic!("Escrow is not in locked state");
        }

        let current_time = env.ledger().timestamp();
        
        // Allowed if expiry time passes (payer claims) or provider explicitly cancels
        if current_time >= record.expire_at {
            // anyone can trigger refund if expired, no auth required, just refund it
        } else {
            // Or if service explicitly cancels (provider must auth)
            record.provider.require_auth();
        }

        record.status = EscrowStatus::Refunded;
        env.storage().persistent().set(&key, &record);
    }

    pub fn get_escrow_status(env: Env, escrow_id: String) -> EscrowStatus {
        let key = DataKey::Escrow(escrow_id.clone());
        let record: EscrowRecord = env.storage().persistent().get(&key).expect("Escrow not found");

        if record.status == EscrowStatus::Locked {
            let current_time = env.ledger().timestamp();
            if current_time >= record.expire_at {
                return EscrowStatus::Expired;
            }
        }
        
        record.status
    }

    pub fn dispute_escrow(env: Env, escrow_id: String, reason: String) {
        let key = DataKey::Escrow(escrow_id.clone());
        let mut record: EscrowRecord = env.storage().persistent().get(&key).expect("Escrow not found");

        // allow payer or provider to dispute
        // we'll require payer auth
        record.payer.require_auth();

        if record.status != EscrowStatus::Locked {
            panic!("Escrow is not in locked state");
        }

        let current_time = env.ledger().timestamp();
        if current_time >= record.expire_at {
            panic!("Escrow has expired");
        }

        record.status = EscrowStatus::Disputed;
        record.dispute_reason = Some(reason);
        env.storage().persistent().set(&key, &record);
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::{testutils::{Address as _, Ledger}, Env};

    #[test]
    fn test_escrow_flow_release() {
        let env = Env::default();
        let contract_id = env.register(EscrowContract, ());
        let client = EscrowContractClient::new(&env, &contract_id);

        let payer = Address::generate(&env);
        let provider = Address::generate(&env);
        let service_id = String::from_str(&env, "service-1");
        env.mock_all_auths();
        env.ledger().set_timestamp(1000);

        let escrow_id = client.create_escrow(&payer, &provider, &service_id, &100, &500);
        
        let status = client.get_escrow_status(&escrow_id);
        assert_eq!(status, EscrowStatus::Locked);

        env.ledger().set_timestamp(1100);
        client.release_payment(&escrow_id);

        let status = client.get_escrow_status(&escrow_id);
        assert_eq!(status, EscrowStatus::Released);
    }

    #[test]
    fn test_escrow_flow_refund_expired() {
        let env = Env::default();
        let contract_id = env.register(EscrowContract, ());
        let client = EscrowContractClient::new(&env, &contract_id);

        let payer = Address::generate(&env);
        let provider = Address::generate(&env);
        let service_id = String::from_str(&env, "service-1");
        env.mock_all_auths();
        env.ledger().set_timestamp(1000);

        let escrow_id = client.create_escrow(&payer, &provider, &service_id, &100, &500);
        
        env.ledger().set_timestamp(1600); // Past 1500
        
        let status = client.get_escrow_status(&escrow_id);
        assert_eq!(status, EscrowStatus::Expired);

        client.refund_payment(&escrow_id);

        let status = client.get_escrow_status(&escrow_id);
        assert_eq!(status, EscrowStatus::Refunded);
    }

    #[test]
    fn test_escrow_flow_dispute() {
        let env = Env::default();
        let contract_id = env.register(EscrowContract, ());
        let client = EscrowContractClient::new(&env, &contract_id);

        let payer = Address::generate(&env);
        let provider = Address::generate(&env);
        let service_id = String::from_str(&env, "service-1");
        env.mock_all_auths();
        env.ledger().set_timestamp(1000);

        let escrow_id = client.create_escrow(&payer, &provider, &service_id, &100, &500);
        
        client.dispute_escrow(&escrow_id, &String::from_str(&env, "Service not delivered"));

        let status = client.get_escrow_status(&escrow_id);
        assert_eq!(status, EscrowStatus::Disputed);
    }
}
