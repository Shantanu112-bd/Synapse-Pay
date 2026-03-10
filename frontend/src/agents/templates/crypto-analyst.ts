import { AgentTemplate } from "./travel-master";

export const CryptoAnalyst: AgentTemplate = {
    id: "crypto-analyst",
    name: "CryptoAnalyst Agent",
    category: "Finance",
    description: "Fetches prices and news, then analyzes market trends using AI.",
    exampleInput: "{ coins: ['BTC', 'ETH'], timeframe: '24h' }",
    exampleOutput: "{ analysis: '...', signals: [...], report: '...', totalCost: '$0.0025' }",
    estimatedCost: "$0.0025 USDC",
    usesApis: ["CoinGecko", "CryptoNewsAPI", "GPT-4"],
    deployCount: 3120,
    rating: 4.9,
    systemPrompt: "You are a crypto market analyst. You fetch prices from CoinGecko, news from CryptoNewsAPI, and use GPT-4 to analyze trends.",
    inputSchema: { coins: "array", timeframe: "string" },
    outputSchema: { analysis: "string", signals: "array", report: "string", totalCost: "number" },
    steps: [
        { name: "Fetching live prices", service: "CoinGecko", cost: 0.0002, duration: 500 },
        { name: "Aggregating crypto news", service: "CryptoNewsAPI", cost: 0.0003, duration: 800 },
        { name: "AI Trend Analysis", service: "GPT Analysis", cost: 0.002, duration: 1800 }
    ]
};
