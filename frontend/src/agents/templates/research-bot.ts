import { AgentTemplate } from "./travel-master";

export const ResearchBot: AgentTemplate = {
    id: "research-bot",
    name: "ResearchBot Agent",
    category: "Research",
    description: "Searches NewsAPI, Wikipedia, and ArXiv, then synthesizes a report using GPT-4.",
    exampleInput: "{ topic: 'Quantum Computing', depth: 'detailed', format: 'markdown' }",
    exampleOutput: "{ summary: '...', sources: [...], report: '...', totalCost: '$0.0028' }",
    estimatedCost: "$0.0028 USDC",
    usesApis: ["NewsAPI", "Wikipedia", "ArXiv", "GPT-4"],
    deployCount: 890,
    rating: 4.8,
    systemPrompt: "You are a deep research AI. You search NewsAPI, Wikipedia, and ArXiv then use GPT-4 to synthesize a structured report. You pay for each source automatically.",
    inputSchema: { topic: "string", depth: "string", format: "string" },
    outputSchema: { summary: "string", sources: "array", report: "string", totalCost: "number" },
    steps: [
        { name: "Querying NewsAPI", service: "NewsDataFeed", cost: 0.0003, duration: 900 },
        { name: "Scraping Wikipedia", service: "WikiData", cost: 0.0001, duration: 600 },
        { name: "Searching ArXiv", service: "ArXivAPI", cost: 0.0004, duration: 1200 },
        { name: "Synthesizing via GPT-4", service: "GPT Analysis", cost: 0.002, duration: 2400 }
    ]
};
