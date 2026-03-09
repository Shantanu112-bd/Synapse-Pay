#![no_std]
use soroban_sdk::{contract, contractimpl, Env};

#[contract]
pub struct Reputation;

#[contractimpl]
impl Reputation {
    pub fn hello(env: Env) {}
}
