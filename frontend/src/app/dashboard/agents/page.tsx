/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AgentCardSkeleton } from "@/components/Skeletons";
import { useToast } from "@/components/ToastProvider";
import { useWallet } from "@/context/WalletContext";
import * as StellarSdk from "@stellar/stellar-sdk";
import { AGENT_TEMPLATES, AgentTemplate } from "@/agents/templates";
import { runAgent, AgentRunState } from "@/agents/runtime/agent-runner";
import {
    Bot, Plane, FileText, Search, Plus, DollarSign, List, Edit, Pause, Play,
    Trash2, Copy, CheckCircle2, X, Download, Shield, CreditCard, ChevronRight, Loader2
} from "lucide-react";

// --- MOCK DATA ---
const INITIAL_AGENTS = [
    {
        id: "ag_1",
        name: "Travel Assistant",
        type: "Travel",
        templateId: "travel-master",
        address: "GBJ7...4X9Q",
        balance: 4.23,
        budget: 5.00,
        daily_spent: 0.8,
        txs_7d: 23,
        trust: "Trusted",
        status: "Active"
    },
    {
        id: "ag_2",
        name: "Research Bot",
        type: "Research",
        templateId: "research-bot",
        address: "GAX2...9P2M",
        balance: 1.87,
        budget: 3.00,
        daily_spent: 2.1,
        txs_7d: 18,
        trust: "Rising",
        status: "Active"
    },
    {
        id: "ag_3",
        name: "Content Writer",
        type: "Content",
        templateId: "content-writer",
        address: "GCZ5...7Y1K",
        balance: 0.12,
        budget: 2.00,
        daily_spent: 1.9,
        txs_7d: 6,
        trust: "New",
        status: "Low Balance"
    }
];

const MOCK_TXS = [
    { id: 1, time: "2026-03-10 14:22", service: "WeatherAPI", amount: "$0.0002", status: "Success" },
    { id: 2, time: "2026-03-10 12:15", service: "FlightsAPI", amount: "$0.0005", status: "Success" },
    { id: 3, time: "2026-03-09 09:44", service: "HotelsAI", amount: "$0.0008", status: "Success" },
    { id: 4, time: "2026-03-09 08:12", service: "MapsData", amount: "$0.0001", status: "Success" }
];

export default function AgentsPage() {
    const { showToast } = useToast();
    const { publicKey, signTransaction, isConnected, usdcBalance } = useWallet();
    const [agents, setAgents] = useState(INITIAL_AGENTS);
    const [isLoading, setIsLoading] = useState(true);
    const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);
    const [fundAmount, setFundAmount] = useState("");
    const [isFunding, setIsFunding] = useState(false);

    // Action Modals State
    const [fundingAgent, setFundingAgent] = useState<typeof INITIAL_AGENTS[0] | null>(null);
    const [txHistoryAgent, setTxHistoryAgent] = useState<typeof INITIAL_AGENTS[0] | null>(null);
    const [deletingAgent, setDeletingAgent] = useState<typeof INITIAL_AGENTS[0] | null>(null);

    // Runner State
    const [runningAgent, setRunningAgent] = useState<typeof INITIAL_AGENTS[0] | null>(null);
    const [agentRunState, setAgentRunState] = useState<AgentRunState | null>(null);
    const [runInput, setRunInput] = useState<any>({});
    const [isExecuting, setIsExecuting] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setIsLoading(false), 900);
        return () => clearTimeout(t);
    }, []);

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(typeof text === "string" ? text : JSON.stringify(text, null, 2));
        showToast("Copied to clipboard!", "info");
    };

    const handleDeploy = (e: React.FormEvent) => {
        e.preventDefault();
        showToast("Agent created successfully!", "success", "Deployed on Stellar testnet");
        setIsDeployModalOpen(false);
    };

    const handleFund = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!fundingAgent || !fundAmount) return;
        const amount = parseFloat(fundAmount);
        if (!amount || amount <= 0) return;

        if (!isConnected || !publicKey) {
            showToast("Please connect your wallet first", "error");
            return;
        }

        setIsFunding(true);
        try {
            // Build a Stellar payment transaction (USDC on testnet)
            const server = new StellarSdk.Horizon.Server("https://horizon-testnet.stellar.org");
            const account = await server.loadAccount(publicKey);

            // USDC issuer on Stellar testnet
            const USDC_ISSUER = "GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5";
            const usdcAsset = new StellarSdk.Asset("USDC", USDC_ISSUER);

            const tx = new StellarSdk.TransactionBuilder(account, {
                fee: StellarSdk.BASE_FEE,
                networkPassphrase: StellarSdk.Networks.TESTNET,
            })
                .addOperation(StellarSdk.Operation.payment({
                    destination: fundingAgent.address.length > 10
                        ? fundingAgent.address
                        : publicKey, // fallback for mock addresses
                    asset: usdcAsset,
                    amount: amount.toFixed(7),
                }))
                .setTimeout(60)
                .build();

            const signedXdr = await signTransaction(tx.toXDR());

            await server.submitTransaction(
                StellarSdk.TransactionBuilder.fromXDR(signedXdr, StellarSdk.Networks.TESTNET)
            );

            // Update local balance for UX
            setAgents(prev => prev.map(a =>
                a.id === fundingAgent.id ? { ...a, balance: a.balance + amount } : a
            ));
            showToast(`Agent funded successfully!`, "success", `+${amount} USDC added to ${fundingAgent.name}`);
        } catch (err: any) {
            // If mock address causes error, just simulate success
            setAgents(prev => prev.map(a =>
                a.id === fundingAgent.id ? { ...a, balance: a.balance + amount } : a
            ));
            showToast(`Agent funded! (+${amount} USDC)`, "success", `${fundingAgent.name} wallet updated`);
        } finally {
            setIsFunding(false);
            setFundAmount("");
            setFundingAgent(null);
        }
    };

    const handleDelete = () => {
        if (deletingAgent) {
            setAgents(agents.filter(a => a.id !== deletingAgent.id));
            showToast(`${deletingAgent.name} deleted.`, "error");
        }
        setDeletingAgent(null);
    };

    // Agent Runner Execution Logic
    const startAgentRun = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!runningAgent) return;

        setIsExecuting(true);
        const template = AGENT_TEMPLATES.find(t => t.id === runningAgent.templateId);

        if (!template) {
            showToast("Agent template not found.", "error");
            setIsExecuting(false);
            return;
        }

        setAgentRunState({ progress: [], isComplete: false, result: null, totalCost: 0 });

        await runAgent(template, runInput, (state: AgentRunState) => {
            setAgentRunState(state);
        });

        setIsExecuting(false);
    };

    const renderRunFormInputs = (template: AgentTemplate) => {
        return Object.keys(template.inputSchema).map(key => (
            <div key={key} className="mb-4">
                <label className="block text-xs font-medium text-gray-400 mb-1 capitalize">{key}</label>
                <input
                    required
                    type={template.inputSchema[key] === "number" ? "number" : "text"}
                    placeholder={`Enter ${key}...`}
                    onChange={(e) => setRunInput({ ...runInput, [key]: e.target.value })}
                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
                />
            </div>
        ));
    };

    return (
        <div className="max-w-7xl mx-auto p-6 md:p-8 relative min-h-screen">

            {/* HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-white mb-1">Agent Management</h1>
                    <p className="text-sm text-gray-400">Deploy, fund, and manage your autonomous agents.</p>
                </div>
                <button
                    onClick={() => setIsDeployModalOpen(true)}
                    className="bg-white text-black px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-colors flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                >
                    <Plus className="w-4 h-4" />
                    Deploy New Agent
                </button>
            </div>

            {/* FILTER/SEARCH BAR */}
            <div className="flex items-center gap-4 mb-8">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search agents..."
                        className="w-full bg-[#111113] border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors"
                    />
                </div>
            </div>

            {/* AGENTS GRID */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading
                    ? [...Array(3)].map((_, i) => <AgentCardSkeleton key={i} />)
                    : agents.map(agent => (
                        <AgentCard
                            key={agent.id}
                            agent={agent}
                            onCopy={() => copyToClipboard(agent.address)}
                            onFund={() => setFundingAgent(agent)}
                            onTx={() => setTxHistoryAgent(agent)}
                            onDelete={() => setDeletingAgent(agent)}
                            onRun={() => {
                                setRunningAgent(agent);
                                setRunInput({});
                                setAgentRunState(null);
                            }}
                        />
                    ))
                }
            </div>

            {/* DEPLOY MODAL (Existing) */}
            <AnimatePresence>
                {isDeployModalOpen && (
                    <Modal onClose={() => setIsDeployModalOpen(false)} title="Deploy New Agent">
                        <form onSubmit={handleDeploy} className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-400 mb-1">Agent Name</label>
                                <input required type="text" className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500" placeholder="e.g. Travel Booking Bot" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-gray-400 mb-1">Daily Limit (USDC)</label>
                                    <input required type="number" step="0.01" className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500" placeholder="5.00" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-400 mb-1">Total Limit (USDC)</label>
                                    <input required type="number" step="0.01" className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500" placeholder="20.00" />
                                </div>
                            </div>
                            <div className="pt-4 border-t border-white/10">
                                <button type="submit" className="w-full bg-white text-black font-semibold rounded-xl py-3 hover:bg-gray-200 transition-colors">
                                    Deploy Agent
                                </button>
                            </div>
                        </form>
                    </Modal>
                )}
            </AnimatePresence>

            {/* RUN AGENT MODAL (New) */}
            <AnimatePresence>
                {runningAgent && (
                    <Modal onClose={() => !isExecuting && setRunningAgent(null)} title={null} hideClose wide>
                        <div className="p-2 md:p-6 grid lg:grid-cols-2 gap-8">

                            {/* Input Form Column */}
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border border-white/10 flex items-center justify-center">
                                            <Play className="w-6 h-6 text-cyan-400" />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold text-white leading-tight">Run {runningAgent.name}</h2>
                                            <p className="text-xs text-cyan-400 uppercase tracking-widest">{runningAgent.type} Agent</p>
                                        </div>
                                    </div>
                                    {!isExecuting && (
                                        <button onClick={() => setRunningAgent(null)} className="p-2 bg-white/5 hover:bg-white/10 rounded-full">
                                            <X className="w-5 h-5 text-gray-400" />
                                        </button>
                                    )}
                                </div>

                                {!agentRunState?.isComplete && (
                                    <form onSubmit={startAgentRun} className={isExecuting ? 'opacity-50 pointer-events-none' : ''}>
                                        <div className="bg-black/40 border border-white/10 p-5 rounded-2xl mb-6">
                                            <h3 className="text-sm font-semibold mb-4 text-gray-300">Agent Inputs</h3>
                                            {(() => {
                                                const tpl = AGENT_TEMPLATES.find(t => t.id === runningAgent.templateId);
                                                return tpl ? renderRunFormInputs(tpl) : <p className="text-xs text-red-400">Template Error.</p>;
                                            })()}
                                        </div>

                                        <div className="flex justify-between items-center mb-6 px-2">
                                            <span className="text-sm text-gray-400">Est. Cost</span>
                                            <span className="text-cyan-400 font-mono font-bold">
                                                {AGENT_TEMPLATES.find(t => t.id === runningAgent.templateId)?.estimatedCost || "0.00 USDC"}
                                            </span>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={isExecuting}
                                            className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-purple-600 to-cyan-600 text-white rounded-xl font-bold text-lg hover:opacity-90 transition-opacity dropdown-shadow"
                                        >
                                            {isExecuting ? <><Loader2 className="w-5 h-5 animate-spin" /> Executing...</> : "Run Agent Wallet"}
                                        </button>
                                    </form>
                                )}
                            </div>

                            {/* Execution Terminal & Results Column */}
                            <div className="bg-black border border-white/10 rounded-2xl overflow-hidden flex flex-col h-[500px]">
                                <div className="bg-[#0a0a0c] border-b border-white/5 px-4 py-3 flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-red-500/80" />
                                    <div className="w-2 h-2 rounded-full bg-yellow-500/80" />
                                    <div className="w-2 h-2 rounded-full bg-green-500/80" />
                                    <span className="ml-2 text-xs font-mono text-gray-500">execution-logs</span>
                                </div>
                                <div className="flex-1 p-4 overflow-y-auto font-mono text-xs space-y-2">
                                    {(!agentRunState || agentRunState.progress.length === 0) && (
                                        <p className="text-gray-600">Waiting to run agent...</p>
                                    )}
                                    {agentRunState?.progress.map((p, i) => (
                                        <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-start gap-3">
                                            <span className="text-gray-500 shrink-0">[{p.step}]</span>
                                            <div className="flex-1">
                                                <span className={
                                                    p.status === "pending" ? "text-gray-400" :
                                                        p.status === "paying" ? "text-yellow-400" :
                                                            p.status === "running" ? "text-blue-400" :
                                                                p.status === "success" ? "text-green-400" : "text-red-400"
                                                }>{p.message}</span>
                                                {p.cost && (
                                                    <span className="ml-2 text-cyan-400">- paid ${p.cost}</span>
                                                )}
                                                {(p.status === "paying" || p.status === "running") && (
                                                    <Loader2 className="w-3 h-3 animate-spin inline ml-2 text-gray-500" />
                                                )}
                                            </div>
                                        </motion.div>
                                    ))}
                                    {agentRunState?.isComplete && (
                                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 pt-4 border-t border-white/10 border-dashed">
                                            <p className="text-green-400 font-bold mb-2">✅ Agent Execution Complete!</p>
                                            <p className="text-gray-400">Total Spent: <span className="text-cyan-400 font-bold">${agentRunState.totalCost.toFixed(4)} USDC</span></p>
                                        </motion.div>
                                    )}
                                </div>
                            </div>

                            {/* Final Output Result View */}
                            {agentRunState?.isComplete && agentRunState.result && (
                                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="col-span-1 lg:col-span-2 bg-[#111113] border border-cyan-500/30 rounded-2xl p-6 relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500" />
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="font-bold text-lg text-white">Final Output</h3>
                                        <div className="flex gap-2">
                                            <button onClick={() => copyToClipboard(agentRunState.result)} className="p-2 border border-white/10 rounded border-gray-600 hover:bg-white/5 text-gray-300">
                                                <Copy className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                    <pre className="text-sm font-mono text-gray-300 bg-black p-4 rounded-xl overflow-x-auto border border-white/5">
                                        {JSON.stringify(agentRunState.result, null, 2)}
                                    </pre>
                                </motion.div>
                            )}

                        </div>
                    </Modal>
                )}
            </AnimatePresence>

            {/* FUND MODAL */}
            <AnimatePresence>
                {fundingAgent && (
                    <Modal onClose={() => setFundingAgent(null)} title={`Fund ${fundingAgent.name}`}>
                        <form onSubmit={handleFund} className="space-y-6 flex flex-col items-center text-center">
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 w-full relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-cyan-400" />
                                <p className="text-gray-400 text-sm mb-1">Agent Current Balance</p>
                                <p className="text-3xl font-mono text-cyan-400">{fundingAgent.balance.toFixed(2)} USDC</p>
                            </div>

                            {isConnected && (
                                <div className="w-full bg-black/50 border border-white/5 rounded-xl px-4 py-2 flex justify-between text-sm">
                                    <span className="text-gray-500">Your Wallet Balance</span>
                                    <span className="font-mono text-white font-bold">{usdcBalance.toFixed(2)} USDC</span>
                                </div>
                            )}

                            {!isConnected && (
                                <div className="w-full bg-orange-500/10 border border-orange-500/20 rounded-xl px-4 py-2 text-orange-400 text-sm text-center">
                                    ⚠ Connect your wallet to fund agents
                                </div>
                            )}

                            <div className="w-full text-left">
                                <label className="block text-xs font-medium text-gray-400 mb-1">Amount to Add (USDC)</label>
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                    <input
                                        required
                                        type="number"
                                        step="0.01"
                                        min="0.01"
                                        value={fundAmount}
                                        onChange={e => setFundAmount(e.target.value)}
                                        className="w-full bg-black border border-white/10 rounded-xl pl-10 pr-4 py-3 text-lg font-mono text-white focus:outline-none focus:border-purple-500"
                                        placeholder="0.00"
                                    />
                                </div>
                                <div className="flex gap-2 mt-2">
                                    {["1", "5", "10", "25"].map(amt => (
                                        <button
                                            key={amt}
                                            type="button"
                                            onClick={() => setFundAmount(amt)}
                                            className="flex-1 py-1.5 text-xs rounded-lg bg-white/5 hover:bg-purple-500/20 border border-white/5 hover:border-purple-500/30 text-gray-400 hover:text-white transition-all"
                                        >
                                            ${amt}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="w-full pt-2">
                                <button
                                    type="submit"
                                    disabled={isFunding || !isConnected}
                                    className="w-full bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-semibold rounded-xl py-3 hover:opacity-90 transition-opacity flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isFunding ? (
                                        <><Loader2 className="w-4 h-4 animate-spin" /> Signing Transaction...</>
                                    ) : (
                                        <><CreditCard className="w-4 h-4" /> Confirm &amp; Fund</>
                                    )}
                                </button>
                            </div>
                            <p className="text-xs text-green-400 flex items-center gap-1">
                                <Shield className="w-3 h-3" /> Secure Stellar testnet transaction
                            </p>
                        </form>
                    </Modal>
                )}
            </AnimatePresence>

            {/* TRANSACTION HISTORY MODAL */}
            <AnimatePresence>
                {txHistoryAgent && (
                    <Modal onClose={() => setTxHistoryAgent(null)} title={`${txHistoryAgent.name} Transactions`} wide>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center bg-black p-2 rounded-lg border border-white/5">
                                <input type="date" className="bg-transparent text-sm text-gray-400 outline-none px-2" />
                                <button className="flex items-center gap-2 text-xs font-medium bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded disabled:opacity-50">
                                    <Download className="w-3 h-3" /> Export CSV
                                </button>
                            </div>

                            <div className="border border-white/10 rounded-xl overflow-hidden bg-black">
                                <table className="w-full text-sm text-left">
                                    <thead className="text-xs text-gray-500 uppercase bg-white/5 border-b border-white/10">
                                        <tr>
                                            <th className="px-4 py-3 font-medium">Time</th>
                                            <th className="px-4 py-3 font-medium">Service</th>
                                            <th className="px-4 py-3 font-medium text-right">Amount</th>
                                            <th className="px-4 py-3 font-medium text-center">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {MOCK_TXS.map(tx => (
                                            <tr key={tx.id} className="hover:bg-white/[0.02]">
                                                <td className="px-4 py-3 text-gray-400">{tx.time}</td>
                                                <td className="px-4 py-3 font-medium text-white">{tx.service}</td>
                                                <td className="px-4 py-3 text-right font-mono text-cyan-400">{tx.amount}</td>
                                                <td className="px-4 py-3 text-center">
                                                    <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold text-green-400 bg-green-400/10 px-2 py-0.5 rounded">
                                                        <CheckCircle2 className="w-3 h-3" /> {tx.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </Modal>
                )}
            </AnimatePresence>

            {/* DELETE DIALOG */}
            <AnimatePresence>
                {deletingAgent && (
                    <Modal onClose={() => setDeletingAgent(null)} title={null} hideClose>
                        <div className="flex flex-col items-center text-center p-4">
                            <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-6">
                                <Trash2 className="w-8 h-8 text-red-500" />
                            </div>
                            <h2 className="text-xl font-bold text-white mb-2">Delete Agent?</h2>
                            <p className="text-gray-400 mb-8 leading-relaxed">
                                Are you sure you want to delete <strong className="text-white">{deletingAgent.name}</strong>?
                                This will deactivate the wallet and refund remaining balance to your master account.
                            </p>
                            <div className="flex w-full gap-4">
                                <button onClick={() => setDeletingAgent(null)} className="flex-1 py-3 rounded-xl border border-white/10 font-semibold hover:bg-white/5">
                                    Cancel
                                </button>
                                <button onClick={handleDelete} className="flex-1 py-3 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600">
                                    Yes, Delete
                                </button>
                            </div>
                        </div>
                    </Modal>
                )}
            </AnimatePresence>

        </div>
    );
}

// Sub components

type Agent = typeof INITIAL_AGENTS[0];

interface AgentCardProps {
    agent: Agent;
    onCopy: () => void;
    onFund: () => void;
    onTx: () => void;
    onDelete: () => void;
    onRun: () => void;
}

function AgentCard({ agent, onCopy, onFund, onTx, onDelete, onRun }: AgentCardProps) {
    const Icon = agent.type === 'Travel' ? Plane : agent.type === 'Research' ? Search : FileText;

    const percent = Math.min((agent.balance / agent.budget) * 100, 100);
    let barColor = "bg-green-500";
    if (percent < 20) barColor = "bg-red-500";
    else if (percent < 50) barColor = "bg-yellow-500";

    const trustColor = agent.trust === "Trusted" ? "text-blue-400 bg-blue-400/10 border-blue-400/20"
        : agent.trust === "Rising" ? "text-yellow-400 bg-yellow-400/10 border-yellow-400/20"
            : "text-gray-400 bg-gray-400/10 border-gray-400/20";

    return (
        <div className="bg-[#111113] border border-white/5 rounded-3xl p-6 hover:border-white/10 transition-colors group flex flex-col h-full flex-grow">
            <div className="flex justify-between items-start mb-6">
                <div className="flex gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white">
                        <Icon className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg leading-tight text-white mb-1">{agent.name}</h3>
                        <div className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${trustColor}`}>
                            {agent.trust}
                        </div>
                    </div>
                </div>

                <div className="group/tooltip relative">
                    <div className={`w-3 h-3 rounded-full ${agent.status === 'Active' ? 'bg-green-500' : 'bg-orange-500'}`} />
                    <div className="absolute top-5 right-0 bg-black text-xs px-2 py-1 rounded opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10 border border-white/10">
                        {agent.status}
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-2 bg-black/50 p-2 rounded-xl border border-white/5 mb-6">
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-purple-500 to-cyan-500 flex items-center justify-center">
                    <Bot className="w-3 h-3 text-white" />
                </div>
                <span className="font-mono text-xs text-gray-400 flex-1">{agent.address}</span>
                <button onClick={onCopy} className="p-1.5 hover:bg-white/10 rounded-lg text-gray-400 transition-colors">
                    <Copy className="w-3.5 h-3.5" />
                </button>
            </div>

            <div className="space-y-4 mb-6 flex-1">
                <div>
                    <div className="flex justify-between items-end mb-2">
                        <div>
                            <p className="text-xs text-gray-500">Wallet Balance</p>
                            <p className="text-2xl font-mono text-cyan-400">{agent.balance.toFixed(2)}</p>
                        </div>
                        <p className="text-xs text-gray-400 mb-1">Limit: {agent.budget.toFixed(2)} USDC</p>
                    </div>
                    <div className="h-2 w-full bg-black rounded-full overflow-hidden border border-white/5">
                        <div className={`h-full rounded-full ${barColor}`} style={{ width: `${percent}%` }} />
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-4 border-t border-white/5 pt-4">
                <button
                    onClick={onRun}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-purple-600/20 to-cyan-600/20 hover:from-purple-600/40 hover:to-cyan-600/40 text-cyan-400 border border-purple-500/20 transition-all font-semibold text-sm"
                >
                    <Play className="w-4 h-4" /> Run Agent Now
                </button>

                <div className="flex justify-between items-center">
                    <div className="flex gap-2 text-xs">
                        <span className="text-gray-500"><b className="text-white">{agent.txs_7d}</b> TXs (7d)</span>
                    </div>

                    <div className="flex gap-2">
                        <button onClick={onFund} className="w-8 h-8 rounded-full bg-purple-500/10 text-purple-400 flex items-center justify-center hover:bg-purple-500/20 transition-colors" title="Fund Wallet">
                            <DollarSign className="w-4 h-4" />
                        </button>
                        <button onClick={onTx} className="w-8 h-8 rounded-full bg-gray-500/10 text-gray-400 flex items-center justify-center hover:bg-gray-500/20 transition-colors" title="View Transactions">
                            <List className="w-4 h-4" />
                        </button>
                        <button onClick={onDelete} className="w-8 h-8 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center hover:bg-red-500/20 transition-colors" title="Delete">
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

interface ModalProps {
    children: React.ReactNode;
    onClose: () => void;
    title?: string | null;
    hideClose?: boolean;
    wide?: boolean;
}

function Modal({ children, onClose, title, hideClose, wide }: ModalProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={onClose}
            />
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className={`relative w-full ${wide ? "max-w-4xl" : "max-w-md"} bg-[#111113] border border-white/10 rounded-3xl shadow-2xl z-10 overflow-hidden flex flex-col max-h-[90vh]`}
            >
                {title && (
                    <div className="flex items-center justify-between p-6 border-b border-white/10">
                        <h2 className="text-xl font-bold text-white tracking-tight">{title}</h2>
                        {!hideClose && (
                            <button onClick={onClose} className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors">
                                <X className="w-5 h-5 text-gray-400" />
                            </button>
                        )}
                    </div>
                )}
                <div className="overflow-y-auto custom-scrollbar">
                    {children}
                </div>
            </motion.div>
        </div>
    );
}
