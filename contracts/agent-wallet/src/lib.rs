#![no_std]
use soroban_sdk::{contract, contractimpl, Env};

#[contract]
pub struct AgentWallet;

#[contractimpl]
impl AgentWallet {
    pub fn hello(env: Env) {}
}
