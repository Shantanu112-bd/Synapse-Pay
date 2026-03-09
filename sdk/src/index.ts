import { Agent } from './agent';
import { Payments } from './payments';
import { Marketplace } from './marketplace';

export { Agent, AgentOptions } from './agent';
export { Payments, Transaction } from './payments';
export { Marketplace, Service } from './marketplace';

export class SynapsPay {
    agent: typeof Agent;
    payments: typeof Payments;
    marketplace: typeof Marketplace;

    constructor() {
        this.agent = Agent;
        this.payments = Payments;
        this.marketplace = Marketplace;
    }
}
