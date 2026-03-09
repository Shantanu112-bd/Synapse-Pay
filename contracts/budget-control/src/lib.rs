#![no_std]
use soroban_sdk::{contract, contractimpl, Env};

#[contract]
pub struct BudgetControl;

#[contractimpl]
impl BudgetControl {
    pub fn hello(env: Env) {}
}
