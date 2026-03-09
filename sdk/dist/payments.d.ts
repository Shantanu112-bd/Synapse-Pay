import { Agent } from './agent';
export interface Transaction {
    id: string;
    serviceId: string;
    amount: number;
    timestamp: string;
    status: string;
    isEscrow: boolean;
}
export declare class Payments {
    agent: Agent;
    history: Transaction[];
    constructor(agent: Agent);
    pay(serviceId: string, amount: number): Promise<boolean>;
    payWithEscrow(serviceId: string, amount: number, expirySeconds?: number): Promise<string>;
    getHistory(): Promise<Transaction[]>;
    getSpendingToday(): Promise<number>;
}
