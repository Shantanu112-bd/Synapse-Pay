export interface AgentOptions {
    type: string;
    dailyBudget: number;
    totalBudget: number;
    categories: string[];
}

export class Agent {
    id: string;
    name: string;
    options: AgentOptions;
    balance: number;
    paused: boolean;

    constructor(id: string, name: string, options: AgentOptions) {
        this.id = id;
        this.name = name;
        this.options = options;
        this.balance = 0;
        this.paused = false;
    }

    static async createAgent(name: string, options: AgentOptions): Promise<Agent> {
        console.log(`Deploying agent: ${name} to Soroban...`);
        const mockId = `ag_${Date.now()}`;
        const agent = new Agent(mockId, name, options);
        console.log(`Agent ${name} created with ID: ${mockId}`);
        return agent;
    }

    async getBalance(): Promise<number> {
        console.log(`Fetching balance for agent ${this.id}...`);
        return this.balance;
    }

    async fund(amount: number): Promise<boolean> {
        console.log(`Funding agent ${this.id} with ${amount} USDC...`);
        this.balance += amount;
        return true;
    }

    async pause(): Promise<boolean> {
        console.log(`Pausing agent ${this.id}...`);
        this.paused = true;
        return true;
    }

    async resume(): Promise<boolean> {
        console.log(`Resuming agent ${this.id}...`);
        this.paused = false;
        return true;
    }
}
