"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Payments = void 0;
class Payments {
    agent;
    history;
    constructor(agent) {
        this.agent = agent;
        this.history = [];
    }
    async pay(serviceId, amount) {
        console.log(`Agent ${this.agent.name} paying ${amount} USDC to ${serviceId}...`);
        if (this.agent.paused) {
            console.log(`Error: Agent is paused`);
            return false;
        }
        if (this.agent.balance < amount) {
            console.log(`Error: Insufficient funds (${this.agent.balance} < ${amount})`);
            return false;
        }
        this.agent.balance -= amount;
        this.history.push({
            id: `tx_${Date.now()}`,
            serviceId,
            amount,
            timestamp: new Date().toISOString(),
            status: 'success',
            isEscrow: false
        });
        return true;
    }
    async payWithEscrow(serviceId, amount, expirySeconds = 3600) {
        console.log(`Agent ${this.agent.name} locking ${amount} USDC in escrow for ${serviceId}...`);
        if (this.agent.paused || this.agent.balance < amount)
            return "";
        this.agent.balance -= amount;
        const escrowId = `esc_${Date.now()}`;
        this.history.push({
            id: escrowId,
            serviceId,
            amount,
            timestamp: new Date().toISOString(),
            status: 'locked_escrow',
            isEscrow: true
        });
        return escrowId;
    }
    async getHistory() {
        return this.history;
    }
    async getSpendingToday() {
        const today = new Date().toISOString().split('T')[0];
        const total = this.history
            .filter(tx => tx.timestamp.startsWith(today))
            .reduce((sum, tx) => sum + tx.amount, 0);
        return total;
    }
}
exports.Payments = Payments;
