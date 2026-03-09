"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AgentCardSkeleton } from "@/components/Skeletons";
import { useToast } from "@/components/ToastProvider";
import {
    Bot,
    Plane,
    FileText,
    Search,
    Plus,
    DollarSign,
    List,
    Edit,
    Pause,
    Play,
    Trash2,
    Copy,
    CheckCircle2,
    X,
    Download,
    Shield,
    CreditCard
} from "lucide-react";

// --- MOCK DATA ---
const INITIAL_AGENTS = [
    {
        id: "ag_1",
        name: "Travel Assistant",
        type: "Travel",
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
    const [agents, setAgents] = useState(INITIAL_AGENTS);
    const [isLoading, setIsLoading] = useState(true);
    const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);
    const [fundingAgent, setFundingAgent] = useState<typeof INITIAL_AGENTS[0] | null>(null);
    const [txHistoryAgent, setTxHistoryAgent] = useState<typeof INITIAL_AGENTS[0] | null>(null);
    const [deletingAgent, setDeletingAgent] = useState<typeof INITIAL_AGENTS[0] | null>(null);

    useEffect(() => {
        const t = setTimeout(() => setIsLoading(false), 900);
        return () => clearTimeout(t);
    }, []);

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        showToast("Copied to clipboard!", "info");
    };

    const handleDeploy = (e: React.FormEvent) => {
        e.preventDefault();
        showToast("Agent created successfully!", "success", "Deployed on Stellar testnet");
        setIsDeployModalOpen(false);
    };

    const handleFund = (e: React.FormEvent) => {
        e.preventDefault();
        if (fundingAgent) {
            showToast(`Agent funded successfully!`, "success", `${fundingAgent.name} wallet updated`);
        }
        setFundingAgent(null);
    };

    const handleDelete = () => {
        if (deletingAgent) {
            setAgents(agents.filter(a => a.id !== deletingAgent.id));
            showToast(`${deletingAgent.name} deleted.`, "error");
        }
        setDeletingAgent(null);
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
                        />
                    ))
                }
            </div>

            {/* DEPLOY MODAL */}
            <AnimatePresence>
                {isDeployModalOpen && (
                    <Modal onClose={() => setIsDeployModalOpen(false)} title="Deploy New Agent">
                        <form onSubmit={handleDeploy} className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-400 mb-1">Agent Name</label>
                                <input required type="text" className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500" placeholder="e.g. Travel Booking Bot" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-400 mb-1">Agent Type</label>
                                <select className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500">
                                    <option>Travel</option>
                                    <option>Research</option>
                                    <option>Content</option>
                                    <option>Custom</option>
                                </select>
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
                            <div>
                                <label className="block text-xs font-medium text-gray-400 mb-1">Description</label>
                                <textarea rows={2} className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500" placeholder="What does this agent do..."></textarea>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-400 mb-2">Allowed Categories</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {['Weather', 'Flights', 'Hotels', 'AI Models', 'Data', 'Search'].map((cat) => (
                                        <label key={cat} className="flex items-center gap-2 text-sm text-gray-300">
                                            <input type="checkbox" className="rounded border-white/10 bg-black text-purple-500 focus:ring-purple-500" />
                                            {cat}
                                        </label>
                                    ))}
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

            {/* FUND MODAL */}
            <AnimatePresence>
                {fundingAgent && (
                    <Modal onClose={() => setFundingAgent(null)} title={`Fund ${fundingAgent.name}`}>
                        <form onSubmit={handleFund} className="space-y-6 flex flex-col items-center text-center">
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 w-full relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-cyan-400" />
                                <p className="text-gray-400 text-sm mb-1">Current Balance</p>
                                <p className="text-3xl font-mono text-cyan-400">{fundingAgent.balance.toFixed(2)} USDC</p>
                            </div>

                            <div className="w-full text-left">
                                <label className="block text-xs font-medium text-gray-400 mb-1">Amount to Add (USDC)</label>
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                    <input required type="number" step="0.01" className="w-full bg-black border border-white/10 rounded-xl pl-10 pr-4 py-3 text-lg font-mono text-white focus:outline-none focus:border-purple-500" placeholder="0.00" />
                                </div>
                            </div>

                            <div className="w-full pt-4">
                                <button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-semibold rounded-xl py-3 hover:opacity-90 transition-opacity flex justify-center items-center gap-2">
                                    <CreditCard className="w-4 h-4" />
                                    Confirm & Fund
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

                            <div className="flex justify-between items-center text-xs text-gray-500">
                                <span>Showing 1 to 4 of 4 entries</span>
                                <div className="flex gap-1">
                                    <button className="px-2 py-1 bg-white/5 rounded hover:bg-white/10 disabled:opacity-30" disabled>Prev</button>
                                    <button className="px-2 py-1 bg-white/5 rounded hover:bg-white/10 disabled:opacity-30" disabled>Next</button>
                                </div>
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
}

function AgentCard({ agent, onCopy, onFund, onTx, onDelete }: AgentCardProps) {
    const Icon = agent.type === 'Travel' ? Plane : agent.type === 'Research' ? Search : FileText;

    // Progress bar logic
    const percent = Math.min((agent.balance / agent.budget) * 100, 100);
    let barColor = "bg-green-500";
    if (percent < 20) barColor = "bg-red-500";
    else if (percent < 50) barColor = "bg-yellow-500";

    const trustColor = agent.trust === "Trusted" ? "text-blue-400 bg-blue-400/10 border-blue-400/20"
        : agent.trust === "Rising" ? "text-yellow-400 bg-yellow-400/10 border-yellow-400/20"
            : "text-gray-400 bg-gray-400/10 border-gray-400/20";

    return (
        <div className="bg-[#111113] border border-white/5 rounded-3xl p-6 hover:border-white/10 transition-colors group flex flex-col">
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

                {/* Status indicator */}
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
                {/* Wallet Balance */}
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

                {/* Daily Spending */}
                <div className="pt-2 border-t border-white/5">
                    <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-500">Spent Today</span>
                        <span className="font-mono text-gray-300">${agent.daily_spent.toFixed(2)}</span>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between border-t border-white/5 pt-4">
                <div className="flex gap-2 text-xs">
                    <span className="text-gray-500"><b className="text-white">{agent.txs_7d}</b> TXs (7d)</span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                    <button onClick={onFund} className="w-8 h-8 rounded-full bg-purple-500/10 text-purple-400 flex items-center justify-center hover:bg-purple-500/20 transition-colors" title="Fund Wallet">
                        <DollarSign className="w-4 h-4" />
                    </button>
                    <button onClick={onTx} className="w-8 h-8 rounded-full bg-gray-500/10 text-gray-400 flex items-center justify-center hover:bg-gray-500/20 transition-colors" title="View Transactions">
                        <List className="w-4 h-4" />
                    </button>
                    <button className="w-8 h-8 rounded-full bg-gray-500/10 text-gray-400 flex items-center justify-center hover:bg-gray-500/20 transition-colors group/edit relative" title="Edit">
                        <Edit className="w-4 h-4" />
                        <div className="absolute bottom-10 bg-black border border-white/10 px-2 py-1 rounded text-xs opacity-0 group-hover/edit:opacity-100 transition-opacity pointer-events-none">Edit</div>
                    </button>
                    <button className="w-8 h-8 rounded-full bg-gray-500/10 text-gray-400 flex items-center justify-center hover:bg-gray-500/20 transition-colors" title="Pause">
                        {agent.status === "Active" ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </button>
                    <button onClick={onDelete} className="w-8 h-8 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center hover:bg-red-500/20 transition-colors" title="Delete">
                        <Trash2 className="w-4 h-4" />
                    </button>
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
                className={`relative w-full ${wide ? "max-w-3xl" : "max-w-md"} bg-[#111113] border border-white/10 rounded-3xl shadow-2xl z-10 overflow-hidden flex flex-col max-h-[90vh]`}
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
                <div className="p-6 overflow-y-auto custom-scrollbar">
                    {children}
                </div>
            </motion.div>
        </div>
    );
}
