/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { AgentTemplate } from "../templates/index";

export interface RunnerProgress {
    step: number;
    message: string;
    status: "pending" | "paying" | "running" | "success" | "failed";
    cost?: number;
}

export interface AgentRunState {
    progress: RunnerProgress[];
    isComplete: boolean;
    result: any;
    error?: string;
    totalCost: number;
}

export type OnProgressFn = (state: AgentRunState) => void;

// Simulate SDK class for local frontend execution
class MockSynapsPaySDK {
    async pay(_serviceName: string, _amount: number) {
        // Simulated network delay
        await new Promise(r => setTimeout(r, 400 + Math.random() * 300));
        return { success: true, txId: `tx_${Date.now()}` };
    }
}

const sdk = new MockSynapsPaySDK();

export async function runAgent(
    agent: AgentTemplate,
    input: any,
    onProgress: OnProgressFn
) {
    let state: AgentRunState = {
        progress: [],
        isComplete: false,
        result: null,
        totalCost: 0
    };

    const updateState = (update: Partial<AgentRunState>) => {
        state = { ...state, ...update };
        onProgress({ ...state });
    };

    const addProgress = (p: RunnerProgress) => {
        state.progress = [...state.progress, p];
        updateState({});
    };

    const updateProgress = (stepIndex: number, p: Partial<RunnerProgress>) => {
        const newProgress = [...state.progress];
        newProgress[stepIndex] = { ...newProgress[stepIndex], ...p };
        state.progress = newProgress;
        updateState({});
    };

    for (let i = 0; i < agent.steps.length; i++) {
        const step = agent.steps[i];

        addProgress({
            step: i + 1,
            message: `Calling ${step.service}...`,
            status: "paying",
            cost: step.cost
        });

        try {
            // Trigger SynapsPay Micropayment via SDK
            const paymentResponse = await sdk.pay(step.service, step.cost);
            if (!paymentResponse.success) throw new Error("Payment failed.");

            state.totalCost += step.cost;
            updateProgress(i, { message: `Executing ${step.name}...`, status: "running" });

            // Simulate API call processing
            await new Promise(r => setTimeout(r, step.duration));

            updateProgress(i, { message: `${step.service} complete!`, status: "success" });
        } catch (err: any) {
            updateProgress(i, { message: `Failed: ${err.message}`, status: "failed" });
            updateState({ error: err.message, isComplete: true });
            return;
        }
    }

    // Generate simulated result
    let finalResult: any = { status: "Success", runDetails: "All tasks completed autonomously." };

    if (agent.id === "travel-master") {
        finalResult = {
            itinerary: ["Day 1: Arrival & Check-in at Grand Plaza", "Day 2: City Tour & Landmarks", "Day 3: Sightseeing & Local Dining"],
            flights: [`AA 123 - Outbound: ${input?.dates?.split("-")?.[0] || 'TBD'}`],
            hotels: ["Grand Plaza Hotel - Confirmed"],
            weather: { temp: "72°F", condition: "Sunny" },
            totalCost: `$${state.totalCost.toFixed(4)}`
        };
    } else if (agent.id === "research-bot") {
        finalResult = {
            summary: `Deep dive analysis on ${input?.topic || 'the selected topic'}. Quantum shifts observed across sources.`,
            sources: ["NewsDataFeed (Verified)", "WikiData Overview", "ArXiv Pre-prints"],
            report: "# Executive Report\n\nGenerated autonomously by GPT-4 after cross-referencing news data.",
            totalCost: `$${state.totalCost.toFixed(4)}`
        };
    } else if (agent.id === "content-writer") {
        finalResult = {
            content: `Discover the top trends changing how we see ${input?.topic || 'technology'} today! 🚀`,
            image_url: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=600",
            totalCost: `$${state.totalCost.toFixed(4)}`
        }
    }

    updateState({ isComplete: true, result: finalResult });
}
