#![no_std]
use soroban_sdk::{contract, contractimpl, Env};

#[contract]
pub struct ServiceRegistry;

#[contractimpl]
impl ServiceRegistry {
    pub fn hello(env: Env) {}
}
