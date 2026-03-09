# SynapsPay 🚀

**A machine-to-machine payment layer for AI agents built on the Stellar blockchain.**

SynapsPay empowers AI agents to autonomously transact, negotiate, and settle payments in real-time, leveraging the speed and low cost of Stellar and Soroban smart contracts.

## 🏗️ Project Structure

- `/frontend`: Next.js 14 Web Application for managing and visualizing agent wallets and registry.
- `/contracts`: Soroban Smart Contracts Workspace.
  - `agent-wallet`: Manages individual agent funds and identity.
  - `service-registry`: Directory of verifiable AI services.
  - `escrow`: Secure conditional payments between agents.
  - `reputation`: On-chain reputation scores built over successful transactions.
  - `budget-control`: Pre-authorized spending limits for agents.
  - `revenue-share`: Splits payments among collaborating agents.
- `/sdk`: JavaScript SDK for seamless integration of SynapsPay into agent runtimes.
- `/docs`: Project architecture and reference documentation.

## ⚙️ Setup

Install dependencies for the frontend:
```bash
cd frontend
npm install
npm run dev
```

Build the Soroban contracts:
```bash
cd contracts
cargo build --target wasm32-unknown-unknown --release
```
