"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Play,
    CheckCircle2,
    XCircle,
    Zap,
    Loader2,
    Code2,
    Terminal,
    RefreshCw,
    Bot,
    CloudLightning,
    Plane,
    Building,
    Home,
    Store,
    BarChart2,
    Settings,
} from "lucide-react";
import Link from "next/link";
import { useToast } from "@/components/ToastProvider";

interface TxResult {
    id: string;
    status: "success" | "failed";
    service: string;
    amount: number;
    agentBalance: number;
    latency: number;
    timestamp: string;
}

const DEMO_SERVICES = [
    { id: "srv_weather", name: "WeatherAPI Pro", price: 0.0002, icon: CloudLightning, category: "Weather" },
    { id: "srv_flights", name: "FlightSearch AI", price: 0.0005, icon: Plane, category: "Flights" },
    { id: "srv_hotels", name: "HotelFinder", price: 0.0008, icon: Building, category: "Hotels" },
];

const NAV = [
    { label: "Dashboard", href: "/dashboard", icon: Home },
    { label: "Agents", href: "/dashboard/agents", icon: Bot },
    { label: "Marketplace", href: "/dashboard/marketplace", icon: Store },
    { label: "Analytics", href: "/dashboard", icon: BarChart2 },
    { label: "Settings", href: "/dashboard", icon: Settings },
];

export default function SandboxPage() {
    const { showToast } = useToast();
    const [agentBalance, setAgentBalance] = useState(10.0);
    const [selectedService, setSelectedService] = useState(DEMO_SERVICES[0]);
    const [callCount, setCallCount] = useState(1);
    const [isRunning, setIsRunning] = useState(false);
    const [results, setResults] = useState<TxResult[]>([]);
    const [logs, setLogs] = useState<string[]>([
        "> SynapsPay Sandbox v0.1.0",
        "> Stellar Testnet connected.",
        "> Agent wallet loaded with 10.00 USDC.",
        "> Ready to simulate payments.",
    ]);

    const addLog = (msg: string) =>
        setLogs((prev) => [...prev.slice(-50), `> ${msg}`]);

    const runSimulation = async () => {
        if (isRunning) return;
        setIsRunning(true);

        addLog(`Simulating ${callCount} call(s) to ${selectedService.name}…`);

        let balance = agentBalance;
        const newResults: TxResult[] = [];

        for (let i = 0; i < callCount; i++) {
            await new Promise((r) => setTimeout(r, 500 + Math.random() * 400));

            const latency = Math.floor(120 + Math.random() * 300);
            const cost = selectedService.price;
            const success = balance >= cost;

            if (success) {
                balance = parseFloat((balance - cost).toFixed(6));
                const tx: TxResult = {
                    id: `tx_${Date.now()}_${i}`,
                    status: "success",
                    service: selectedService.name,
                    amount: cost,
                    agentBalance: balance,
                    latency,
                    timestamp: new Date().toISOString(),
                };
                newResults.push(tx);
                addLog(`✅ Payment #${i + 1}: $${cost} → ${selectedService.name} | ${latency}ms`);

                showToast(`Payment sent: $${cost} to ${selectedService.name}`, "success");

                if (balance < 0.5) {
                    showToast(`Low balance alert: ${balance.toFixed(4)} USDC remaining`, "warning");
                    addLog(`⚠️  Low balance: ${balance.toFixed(4)} USDC remaining`);
                }
            } else {
                const tx: TxResult = {
                    id: `tx_${Date.now()}_${i}`,
                    status: "failed",
                    service: selectedService.name,
                    amount: cost,
                    agentBalance: balance,
                    latency,
                    timestamp: new Date().toISOString(),
                };
                newResults.push(tx);
                addLog(`❌ Payment #${i + 1}: Insufficient funds — agent budget limit reached`);
                showToast("Budget limit reached — agent paused", "error");
                break;
            }
        }

        setAgentBalance(balance);
        setResults((prev) => [...newResults, ...prev].slice(0, 20));
        setIsRunning(false);
        addLog(`Simulation complete. Balance: ${balance.toFixed(4)} USDC`);
    };

    const resetSandbox = () => {
        setAgentBalance(10.0);
        setResults([]);
        setLogs([
            "> SynapsPay Sandbox v0.1.0",
            "> Stellar Testnet connected.",
            "> Agent wallet reset with 10.00 USDC.",
            "> Ready to simulate payments.",
        ]);
        showToast("Sandbox reset — 10 USDC loaded", "info");
    };

    return (
        <div className="flex h-screen bg-[#000] text-gray-200 overflow-hidden">
            {/* Sidebar */}
            <aside className="hidden md:flex flex-col w-[220px] shrink-0 border-r border-white/5 bg-black py-6 px-4 gap-1">
                <div className="flex items-center gap-2 mb-8 px-2">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-600 to-cyan-400 flex items-center justify-center">
                        <Zap className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-bold text-sm tracking-tight text-white">SynapsPay</span>
                    <span className="text-[9px] font-bold text-orange-500 bg-orange-500/10 border border-orange-500/20 px-1.5 py-0.5 rounded-full uppercase tracking-wider ml-auto">Testnet</span>
                </div>
                {NAV.map(({ label, href, icon: Icon }) => (
                    <Link
                        key={label}
                        href={href}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${label === "Analytics"
                                ? "text-gray-500 cursor-default"
                                : "text-gray-400 hover:text-white hover:bg-white/5"
                            }`}
                    >
                        <Icon className="w-4 h-4" />
                        {label}
                    </Link>
                ))}
                <div className="mt-auto">
                    <Link
                        href="/sandbox"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium bg-purple-600/20 text-purple-400 border border-purple-500/20"
                    >
                        <Terminal className="w-4 h-4" />
                        Sandbox
                    </Link>
                </div>
            </aside>

            {/* Main */}
            <main className="flex-1 overflow-y-auto">
                <div className="max-w-6xl mx-auto p-6 md:p-8 space-y-8">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
                                <Terminal className="w-6 h-6 text-purple-400" />
                                Developer Sandbox
                                <span className="text-[10px] font-bold uppercase tracking-widest text-purple-400 bg-purple-400/10 px-2 py-0.5 rounded border border-purple-400/20">Simulated</span>
                            </h1>
                            <p className="text-sm text-gray-400 mt-1">Test agent payments with fake USDC. No real funds used.</p>
                        </div>
                        <button
                            onClick={resetSandbox}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-medium transition-all"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Reset Sandbox
                        </button>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-6">
                        {/* Left: Config Panel */}
                        <div className="space-y-6">
                            {/* Agent Balance Card */}
                            <div className="bg-[#111113] border border-white/5 rounded-2xl p-5">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-sm font-semibold text-gray-300">Agent Wallet Balance</span>
                                    <Bot className="w-4 h-4 text-purple-400" />
                                </div>
                                <div className="text-3xl font-bold text-white font-mono mb-1">
                                    {agentBalance.toFixed(4)} <span className="text-lg text-gray-400">USDC</span>
                                </div>
                                <div className="mt-3 h-1.5 bg-white/5 rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full"
                                        animate={{ width: `${Math.min(100, (agentBalance / 10) * 100)}%` }}
                                        transition={{ type: "spring", stiffness: 200, damping: 20 }}
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-1.5">{((agentBalance / 10) * 100).toFixed(1)}% of 10 USDC remaining</p>
                            </div>

                            {/* Service Selector */}
                            <div className="bg-[#111113] border border-white/5 rounded-2xl p-5 space-y-4">
                                <h2 className="text-sm font-semibold text-gray-300">Select Service</h2>
                                <div className="space-y-2">
                                    {DEMO_SERVICES.map((srv) => {
                                        const Icon = srv.icon;
                                        return (
                                            <button
                                                key={srv.id}
                                                onClick={() => setSelectedService(srv)}
                                                className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${selectedService.id === srv.id
                                                        ? "bg-purple-600/10 border-purple-500/30 text-white"
                                                        : "bg-black/30 border-white/5 text-gray-400 hover:border-white/10 hover:text-white"
                                                    }`}
                                            >
                                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${selectedService.id === srv.id ? "bg-purple-500/20" : "bg-white/5"}`}>
                                                    <Icon className="w-4 h-4" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium">{srv.name}</p>
                                                    <p className="text-xs text-gray-500">{srv.category}</p>
                                                </div>
                                                <span className="text-xs font-mono font-bold text-cyan-400">${srv.price}/call</span>
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Call count */}
                                <div>
                                    <label className="text-xs text-gray-400 mb-2 block">Number of API Calls to Simulate</label>
                                    <div className="flex items-center gap-3">
                                        {[1, 5, 10, 50, 100].map((n) => (
                                            <button
                                                key={n}
                                                onClick={() => setCallCount(n)}
                                                className={`px-3 py-1.5 rounded-lg text-sm font-mono font-medium transition-all border ${callCount === n
                                                        ? "bg-purple-600/20 border-purple-500/40 text-purple-400"
                                                        : "bg-black/30 border-white/5 text-gray-500 hover:text-white hover:border-white/10"
                                                    }`}
                                            >
                                                {n}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <motion.button
                                    onClick={runSimulation}
                                    disabled={isRunning}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.97 }}
                                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-semibold text-sm hover:opacity-90 disabled:opacity-50 transition-all shadow-lg"
                                >
                                    {isRunning ? (
                                        <><Loader2 className="w-4 h-4 animate-spin" /> Simulating…</>
                                    ) : (
                                        <><Play className="w-4 h-4" /> Run Simulation</>
                                    )}
                                </motion.button>
                            </div>

                            {/* Cost Estimate */}
                            <div className="bg-[#111113] border border-white/5 rounded-2xl p-5">
                                <h2 className="text-sm font-semibold text-gray-300 mb-3">Cost Estimate</h2>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between text-gray-400">
                                        <span>Service</span>
                                        <span className="text-white">{selectedService.name}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-400">
                                        <span>Price per call</span>
                                        <span className="text-white font-mono">${selectedService.price}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-400">
                                        <span>Calls</span>
                                        <span className="text-white font-mono">×{callCount}</span>
                                    </div>
                                    <div className="border-t border-white/5 pt-2 flex justify-between font-semibold">
                                        <span className="text-gray-300">Total Cost</span>
                                        <span className="text-cyan-400 font-mono">${(selectedService.price * callCount).toFixed(6)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-400 text-xs">
                                        <span>Remaining after</span>
                                        <span className={`font-mono ${agentBalance - selectedService.price * callCount < 0.5 ? "text-orange-400" : "text-gray-300"}`}>
                                            {Math.max(0, agentBalance - selectedService.price * callCount).toFixed(4)} USDC
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right: Terminal + Results */}
                        <div className="space-y-6">
                            {/* Terminal */}
                            <div className="bg-black border border-white/5 rounded-2xl overflow-hidden">
                                <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-[#0a0a0c]">
                                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                                    <span className="text-xs text-gray-500 ml-2 font-mono">synapsepay-sandbox</span>
                                    <Code2 className="w-3.5 h-3.5 text-gray-600 ml-auto" />
                                </div>
                                <div className="p-4 h-52 overflow-y-auto font-mono text-xs text-green-400 space-y-0.5 scrollbar-none">
                                    {logs.map((log, i) => (
                                        <div key={i} className="leading-relaxed whitespace-pre-wrap break-all">
                                            {log}
                                        </div>
                                    ))}
                                    {isRunning && (
                                        <div className="flex items-center gap-1.5 text-yellow-400">
                                            <Loader2 className="w-3 h-3 animate-spin" />
                                            Processing…
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Transaction Results */}
                            <div className="bg-[#111113] border border-white/5 rounded-2xl overflow-hidden">
                                <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
                                    <h2 className="text-sm font-semibold text-gray-300">Mock Transaction Results</h2>
                                    <span className="text-xs text-gray-500">{results.length} transactions</span>
                                </div>
                                <div className="divide-y divide-white/5 max-h-72 overflow-y-auto">
                                    <AnimatePresence>
                                        {results.length === 0 ? (
                                            <div className="py-12 text-center text-gray-600 text-sm">
                                                <Play className="w-8 h-8 mx-auto mb-3 opacity-30" />
                                                Run a simulation to see mock transactions
                                            </div>
                                        ) : (
                                            results.map((tx) => (
                                                <motion.div
                                                    key={tx.id}
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: "auto" }}
                                                    className="flex items-center gap-3 px-5 py-3"
                                                >
                                                    {tx.status === "success" ? (
                                                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                                    ) : (
                                                        <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                                                    )}
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-xs font-medium text-white truncate">{tx.service}</p>
                                                        <p className="text-[10px] text-gray-500 font-mono">{tx.id}</p>
                                                    </div>
                                                    <div className="text-right shrink-0">
                                                        <p className="text-xs font-mono text-cyan-400">-${tx.amount}</p>
                                                        <p className="text-[10px] text-gray-600">{tx.latency}ms</p>
                                                    </div>
                                                </motion.div>
                                            ))
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>

                            {/* Stats row */}
                            {results.length > 0 && (
                                <div className="grid grid-cols-3 gap-3">
                                    {[
                                        { label: "Total Calls", value: results.length },
                                        { label: "Successful", value: results.filter(t => t.status === "success").length },
                                        {
                                            label: "USDC Spent",
                                            value: `$${results.filter(t => t.status === "success").reduce((s, t) => s + t.amount, 0).toFixed(4)}`,
                                        },
                                    ].map((stat) => (
                                        <div key={stat.label} className="bg-[#111113] border border-white/5 rounded-xl p-3 text-center">
                                            <p className="text-lg font-bold text-white">{stat.value}</p>
                                            <p className="text-[10px] text-gray-500">{stat.label}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
