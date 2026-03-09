export interface AgentOptions {
    type: string;
    dailyBudget: number;
    totalBudget: number;
    categories: string[];
}
export declare class Agent {
    id: string;
    name: string;
    options: AgentOptions;
    balance: number;
    paused: boolean;
    constructor(id: string, name: string, options: AgentOptions);
    static createAgent(name: string, options: AgentOptions): Promise<Agent>;
    getBalance(): Promise<number>;
    fund(amount: number): Promise<boolean>;
    pause(): Promise<boolean>;
    resume(): Promise<boolean>;
}
