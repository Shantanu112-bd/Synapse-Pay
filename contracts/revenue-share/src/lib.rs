#![no_std]
use soroban_sdk::{contract, contractimpl, Env};

#[contract]
pub struct RevenueShare;

#[contractimpl]
impl RevenueShare {
    pub fn hello(env: Env) {}
}
