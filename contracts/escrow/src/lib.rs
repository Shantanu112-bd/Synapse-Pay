#![no_std]
use soroban_sdk::{contract, contractimpl, Env};

#[contract]
pub struct Escrow;

#[contractimpl]
impl Escrow {
    pub fn hello(env: Env) {}
}
