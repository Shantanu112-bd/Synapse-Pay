#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, symbol_short, Address, Env, String, Vec};

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Service {
    pub id: String,
    pub name: String,
    pub description: String,
    pub price_per_call: i128,
    pub owner: Address,
    pub endpoint: String,
    pub category: String,
    pub active: bool,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct ServiceStats {
    pub total_calls: u64,
    pub total_revenue: i128,
    pub rating: u32,
}

#[contracttype]
pub enum DataKey {
    Service(String),
    Stats(String),
    AllServices,
    Nonce,
}

#[contract]
pub struct ServiceRegistry;

fn validate_category(env: &Env, category: &String) {
    let valid_categories = [
        String::from_str(env, "weather"),
        String::from_str(env, "flights"),
        String::from_str(env, "hotels"),
        String::from_str(env, "maps"),
        String::from_str(env, "data"),
        String::from_str(env, "ai-models"),
        String::from_str(env, "compute"),
    ];
    let mut is_valid = false;
    for valid_cat in valid_categories.iter() {
        if *category == *valid_cat {
            is_valid = true;
            break;
        }
    }
    if !is_valid {
        panic!("Invalid category");
    }
}

fn generate_service_id(env: &Env) -> String {
    let mut nonce: u64 = env.storage().persistent().get(&DataKey::Nonce).unwrap_or(0);
    nonce += 1;
    env.storage().persistent().set(&DataKey::Nonce, &nonce);
    
    let mut buf = [0u8; 32];
    let prefix = b"service-";
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
impl ServiceRegistry {
    pub fn register_service(
        env: Env,
        name: String,
        description: String,
        price_per_call: i128,
        owner: Address,
        endpoint: String,
        category: String,
    ) -> String {
        owner.require_auth();
        validate_category(&env, &category);

        if price_per_call < 0 {
            panic!("Price cannot be negative");
        }

        let service_id = generate_service_id(&env);

        let service = Service {
            id: service_id.clone(),
            name,
            description,
            price_per_call,
            owner: owner.clone(),
            endpoint,
            category,
            active: true,
        };

        let stats = ServiceStats {
            total_calls: 0,
            total_revenue: 0,
            rating: 0,
        };

        env.storage().persistent().set(&DataKey::Service(service_id.clone()), &service);
        env.storage().persistent().set(&DataKey::Stats(service_id.clone()), &stats);

        let mut all_services: Vec<String> = env.storage().persistent().get(&DataKey::AllServices).unwrap_or(Vec::new(&env));
        all_services.push_back(service_id.clone());
        env.storage().persistent().set(&DataKey::AllServices, &all_services);

        env.events().publish((symbol_short!("ServReg"), service_id.clone()), owner);

        service_id
    }

    pub fn get_service(env: Env, service_id: String) -> Service {
        let key = DataKey::Service(service_id);
        env.storage().persistent().get(&key).expect("Service not found")
    }

    pub fn list_services(env: Env, category: Option<String>) -> Vec<Service> {
        let all_services: Vec<String> = env.storage().persistent().get(&DataKey::AllServices).unwrap_or(Vec::new(&env));
        let mut result: Vec<Service> = Vec::new(&env);

        for service_id in all_services.iter() {
            if let Some(service) = env.storage().persistent().get::<_, Service>(&DataKey::Service(service_id)) {
                if service.active {
                    match &category {
                        Some(c) => {
                            if service.category == c.clone() {
                                result.push_back(service);
                            }
                        }
                        None => {
                            result.push_back(service);
                        }
                    }
                }
            }
        }
        result
    }

    pub fn update_price(env: Env, service_id: String, new_price: i128) {
        if new_price < 0 {
            panic!("Price cannot be negative");
        }
        let key = DataKey::Service(service_id.clone());
        let mut service: Service = env.storage().persistent().get(&key).expect("Service not found");
        service.owner.require_auth();
        
        service.price_per_call = new_price;
        env.storage().persistent().set(&key, &service);
    }

    pub fn deactivate_service(env: Env, service_id: String) {
        let key = DataKey::Service(service_id.clone());
        let mut service: Service = env.storage().persistent().get(&key).expect("Service not found");
        service.owner.require_auth();
        
        service.active = false;
        env.storage().persistent().set(&key, &service);
    }

    pub fn get_service_stats(env: Env, service_id: String) -> ServiceStats {
        let key = DataKey::Stats(service_id);
        env.storage().persistent().get(&key).expect("Service stats not found")
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::{testutils::{Address as _, Ledger}, Env};

    #[test]
    fn test_service_registry_flow() {
        let env = Env::default();
        let contract_id = env.register(ServiceRegistry, ());
        let client = ServiceRegistryClient::new(&env, &contract_id);

        let owner = Address::generate(&env);
        env.mock_all_auths();

        let service_name = String::from_str(&env, "WeatherAPI");
        let desc = String::from_str(&env, "Provides weather data");
        let endpoint = String::from_str(&env, "https://api.weather.com");
        let category = String::from_str(&env, "weather");

        let service_id = client.register_service(
            &service_name,
            &desc,
            &50,
            &owner,
            &endpoint,
            &category,
        );

        // Fetch Service
        let service = client.get_service(&service_id);
        assert_eq!(service.name, service_name);
        assert_eq!(service.price_per_call, 50);
        assert_eq!(service.active, true);

        // Fetch Stats
        let stats = client.get_service_stats(&service_id);
        assert_eq!(stats.total_calls, 0);

        // List Services
        let category_filter = Some(category.clone());
        let all_weather = client.list_services(&category_filter);
        assert_eq!(all_weather.len(), 1);

        let other_filter = Some(String::from_str(&env, "data"));
        let empty_list = client.list_services(&other_filter);
        assert_eq!(empty_list.len(), 0);

        let no_filter: Option<String> = None;
        let all = client.list_services(&no_filter);
        assert_eq!(all.len(), 1);

        // Update Price
        client.update_price(&service_id, &75);
        let updated = client.get_service(&service_id);
        assert_eq!(updated.price_per_call, 75);

        // Deactivate
        client.deactivate_service(&service_id);
        let all_active = client.list_services(&no_filter);
        assert_eq!(all_active.len(), 0); // Excludes inactive services
    }
    
    #[test]
    #[should_panic(expected = "Invalid category")]
    fn test_invalid_category() {
        let env = Env::default();
        let contract_id = env.register(ServiceRegistry, ());
        let client = ServiceRegistryClient::new(&env, &contract_id);

        let owner = Address::generate(&env);
        env.mock_all_auths();

        client.register_service(
            &String::from_str(&env, "Test"),
            &String::from_str(&env, "Desc"),
            &50,
            &owner,
            &String::from_str(&env, "url"),
            &String::from_str(&env, "invalid"),
        );
    }
}
