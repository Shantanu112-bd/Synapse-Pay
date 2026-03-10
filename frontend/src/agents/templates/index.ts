import { TravelMaster, AgentTemplate } from "./travel-master";
import { ResearchBot } from "./research-bot";
import { ContentWriter } from "./content-writer";
import { CryptoAnalyst } from "./crypto-analyst";
import { CodeReviewer } from "./code-reviewer";
import { CustomerSupport } from "./customer-support";

export const AGENT_TEMPLATES: AgentTemplate[] = [
    TravelMaster,
    ResearchBot,
    ContentWriter,
    CryptoAnalyst,
    CodeReviewer,
    CustomerSupport
];

export type { AgentTemplate };
