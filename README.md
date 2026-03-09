# SynapsPay 🚀

**A machine-to-machine payment layer for AI agents built on the Stellar blockchain.**

SynapsPay empowers AI agents to autonomously transact, negotiate, and settle payments in real-time, leveraging the speed and low cost of Stellar and Soroban smart contracts.

[![SynapsPay CI/CD](https://github.com/Shantanu112-bd/Synapse-Pay/actions/workflows/deploy.yml/badge.svg)](https://github.com/Shantanu112-bd/Synapse-Pay/actions/workflows/deploy.yml)

## 🌐 Live Deployment
- **Live Vercel Hub:** [SynapsPay Dashboard (Vercel Node)](https://synapsepay-codehunter.vercel.app/)

## 📜 Deployed Soroban Contracts (Stellar Testnet)
| Contract Name | Contract ID (Address) |
| ------------- | --------------------- |
| **Agent Wallet** | `CAWQGZPHVFBICLPXJFNXBK7OLM63ENAUCVOK2INNVKVWABSTX3M2LX4D` |
| **Budget Control** | `CCURL4GXJ67U26ZPKEQQ6GJNIY3S3TGKSZ7ZDQUWTRC5O6UKSUK4GJO7` |
| **Service Registry** | `CCLLHBKMMDH2YN2Z3JRN4K6MJWLWUUSGV4FUH4XSXHHDHJCOH5WCIGVS` |
| **Escrow** | `CC2ZYHFCNE6T6BB65D4OJGE2DKLQ675ZKLODZAQ74KLVSW73KRYJDUGN` |
| **Reputation** | `CCLZ226J7SWTVJ7BTVY6SJNDPZAWKGFAP4C676LM5F43S3DBFOUVZDDU` |
| **Revenue Share** | `CABR54NQXQBKWL7RPCHQWBUZWDQY27RDG3ENAVPMFRCVWTZ6RDN3H2ZY` |
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
