import { AgentTemplate } from "./travel-master";

export const CodeReviewer: AgentTemplate = {
    id: "code-reviewer",
    name: "CodeReviewer Agent",
    category: "Development",
    description: "Fetches PR diffs and uses GPT-4 to analyze code quality and security.",
    exampleInput: "{ repo: 'org/repo', pr_number: 42 }",
    exampleOutput: "{ review: '...', issues: [...], suggestions: [...], totalCost: '$0.0021' }",
    estimatedCost: "$0.0021 USDC",
    usesApis: ["GitHub", "GPT-4"],
    deployCount: 1540,
    rating: 4.7,
    systemPrompt: "You are a code review AI. You fetch the PR from GitHub and use GPT-4 to analyze code quality, bugs, and security.",
    inputSchema: { repo: "string", pr_number: "number" },
    outputSchema: { review: "string", issues: "array", suggestions: "array", totalCost: "number" },
    steps: [
        { name: "Fetching PR Diff from GitHub", service: "GitHub API", cost: 0.0001, duration: 900 },
        { name: "Analyzing Code & Security", service: "GPT Analysis", cost: 0.002, duration: 3200 }
    ]
};
