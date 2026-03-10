import { AgentTemplate } from "./travel-master";

export const CustomerSupport: AgentTemplate = {
    id: "customer-support",
    name: "SupportBot Agent",
    category: "Support",
    description: "Reads support tickets, drafts AI responses, and sends them via email.",
    exampleInput: "{ ticket_id: 'T-9871', customer_query: 'Reset password' }",
    exampleOutput: "{ response: '...', category: 'auth', resolved: true, totalCost: '$0.0023' }",
    estimatedCost: "$0.0023 USDC",
    usesApis: ["Zendesk", "GPT-4", "SendGrid"],
    deployCount: 4231,
    rating: 4.5,
    systemPrompt: "You are a customer support AI. You read the support ticket and use GPT-4 to draft a response, then send via email API.",
    inputSchema: { ticket_id: "string", customer_query: "string" },
    outputSchema: { response: "string", category: "string", resolved: "boolean", totalCost: "number" },
    steps: [
        { name: "Loading ticket details", service: "Zendesk API", cost: 0.0001, duration: 600 },
        { name: "Drafting response", service: "GPT Analysis", cost: 0.002, duration: 1500 },
        { name: "Sending email reply", service: "SendGrid API", cost: 0.0002, duration: 400 }
    ]
};
