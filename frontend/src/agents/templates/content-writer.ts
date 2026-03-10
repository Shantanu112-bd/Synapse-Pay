import { AgentTemplate } from "./travel-master";

export const ContentWriter: AgentTemplate = {
    id: "content-writer",
    name: "ContentWriter Agent",
    category: "Content",
    description: "Generates content via GPT-4, checks it with Grammarly, and downloads an Unsplash image.",
    exampleInput: "{ topic: 'AI in 2026', platform: 'LinkedIn', tone: 'professional', length: 500 }",
    exampleOutput: "{ content: '...', image_url: '...', totalCost: '$0.003' }",
    estimatedCost: "$0.003 USDC",
    usesApis: ["GPT-4", "Grammarly", "Unsplash"],
    deployCount: 2045,
    rating: 4.6,
    systemPrompt: "You are a content creation AI. You use GPT-4 to generate content, Grammarly to check it, and Unsplash to find images. You pay for each tool automatically.",
    inputSchema: { topic: "string", platform: "string", tone: "string", length: "number" },
    outputSchema: { content: "string", image_url: "string", totalCost: "number" },
    steps: [
        { name: "Drafting content with GPT-4", service: "GPT Analysis", cost: 0.002, duration: 2500 },
        { name: "Grammar & plagiarism check", service: "Grammarly Pro", cost: 0.0005, duration: 1400 },
        { name: "Sourcing stock image", service: "Unsplash API", cost: 0.0005, duration: 700 }
    ]
};
