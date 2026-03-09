"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Home,
    Bot,
    Store,
    BarChart2,
    Settings,
    Zap,
    CheckCircle2,
    TrendingUp,
    CreditCard,
    Orbit,
    MoreVertical,
    ArrowRight,
} from "lucide-react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

// --- Mock Data ---
const MOCK_ACTIVITY = [
    { id: 1, agent: "Travel Assistant", service: "WeatherAPI", amount: "0.0002", time: "2s ago", color: "text-purple-400" },
    { id: 2, agent: "Research Bot", service: "NewsDataFeed", amount: "0.0003", time: "5s ago", color: "text-cyan-400" },
    { id: 3, agent: "Travel Assistant", service: "FlightsAPI", amount: "0.0005", time: "12s ago", color: "text-purple-400" },
    { id: 4, agent: "Content Writer", service: "GPT Analysis", amount: "0.002", time: "45s ago", color: "text-orange-400" },
];

const MOCK_CHART_DATA = [
    { day: "Mon", travel: 0.0012, research: 0.0008, content: 0.0005 },
    { day: "Tue", travel: 0.0015, research: 0.0011, content: 0.0002 },
    { day: "Wed", travel: 0.0018, research: 0.0019, content: 0.0010 },
    { day: "Thu", travel: 0.0022, research: 0.0014, content: 0.0008 },
    { day: "Fri", travel: 0.0028, research: 0.0021, content: 0.0015 },
    { day: "Sat", travel: 0.0035, research: 0.0015, content: 0.0004 },
    { day: "Sun", travel: 0.0041, research: 0.0025, content: 0.0012 },
];

const MOCK_SERVICES = [
    { service: "WeatherAPI Pro", category: "Weather", calls: 234, cost: "$0.047" },
    { service: "FlightSearch AI", category: "Flights", calls: 89, cost: "$0.044" },
    { service: "GPT Analysis", category: "AI Model", calls: 23, cost: "$0.046" },
    { service: "NewsDataFeed", category: "Data", calls: 156, cost: "$0.047" },
    { service: "HotelFinder", category: "Hotels", calls: 67, cost: "$0.054" },
];

export default function Dashboard() {
    const [activeTab, setActiveTab] = useState("dashboard");

    return (
        <div className="flex h-screen bg-[#0a0a0c] text-white overflow-hidden font-sans selection:bg-purple-500/30">
            {/* DESKTOP SIDEBAR */}
            <aside className="hidden md:flex flex-col w-64 border-r border-white/10 bg-[#0a0a0c] z-20">
                <div className="h-20 flex items-center px-6 border-b border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-cyan-400 flex items-center justify-center shadow-lg">
                            <Zap className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-bold text-lg tracking-tight">SynapsPay</span>
                    </div>
                </div>

                <nav className="flex-1 py-8 px-4 space-y-2">
                    <NavItem icon={<Home className="w-5 h-5" />} label="Dashboard" active={activeTab === "dashboard"} onClick={() => setActiveTab("dashboard")} />
                    <NavItem icon={<Bot className="w-5 h-5" />} label="My Agents" active={activeTab === "agents"} onClick={() => setActiveTab("agents")} />
                    <NavItem icon={<Store className="w-5 h-5" />} label="Marketplace" active={activeTab === "market"} onClick={() => setActiveTab("market")} />
                    <NavItem icon={<BarChart2 className="w-5 h-5" />} label="Analytics" active={activeTab === "analytics"} onClick={() => setActiveTab("analytics")} />
                    <NavItem icon={<Settings className="w-5 h-5" />} label="Settings" active={activeTab === "settings"} onClick={() => setActiveTab("settings")} />
                </nav>

                <div className="p-4 border-t border-white/10">
                    <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-3 flex items-center gap-3">
                        <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-orange-500"></span>
                        </span>
                        <div className="flex flex-col">
                            <span className="text-xs font-semibold text-orange-400">Stellar Testnet</span>
                            <span className="text-[10px] text-orange-400/60 font-mono">Connected</span>
                        </div>
                    </div>
                </div>
            </aside>

            {/* MAIN CONTENT AREA */}
            <main className="flex-1 flex flex-col h-full overflow-y-auto bg-[#0a0a0c]/50">
                <div className="max-w-7xl mx-auto w-full p-6 md:p-8 space-y-8 pb-32 md:pb-8">

                    <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">Overview</h1>
                            <p className="text-sm text-gray-400">Manage your autonomous agents and their spending.</p>
                        </div>
                        <button className="bg-white text-black px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-200 transition-colors flex items-center gap-2">
                            <Orbit className="w-4 h-4" />
                            Deploy Agent
                        </button>
                    </header>

                    {/* STATS BAR */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatCard title="Total Agents" value="3" icon={<Bot className="text-purple-400 w-5 h-5" />} trend="+1 this week" />
                        <StatCard title="Spent Today" value="$0.0047 USDC" icon={<CreditCard className="text-cyan-400 w-5 h-5" />} trend="+12% from yesterday" />
                        <StatCard title="Active Services" value="12" icon={<Store className="text-orange-400 w-5 h-5" />} trend="Across 4 categories" />
                        <StatCard title="Transactions Today" value="47" icon={<TrendingUp className="text-green-400 w-5 h-5" />} trend="Real-time settlement" />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* LEFT COLUMN: AGENTS & CHARTS */}
                        <div className="lg:col-span-2 space-y-8">

                            {/* MY AGENTS */}
                            <section>
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-lg font-bold">My Agents</h2>
                                    <button className="text-sm text-cyan-400 hover:text-cyan-300">View All</button>
                                </div>
                                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                                    <AgentCard
                                        name="Travel Assistant"
                                        balance="4.23"
                                        budget="5.00"
                                        txs={23}
                                        badge="Trusted"
                                        badgeColor="text-blue-400 bg-blue-400/10 border-blue-400/20"
                                        status="Active"
                                        statusColor="bg-green-500"
                                    />
                                    <AgentCard
                                        name="Research Bot"
                                        balance="1.87"
                                        budget="3.00"
                                        txs={18}
                                        badge="Rising"
                                        badgeColor="text-yellow-400 bg-yellow-400/10 border-yellow-400/20"
                                        status="Active"
                                        statusColor="bg-green-500"
                                    />
                                    <AgentCard
                                        name="Content Writer"
                                        balance="0.12"
                                        budget="2.00"
                                        txs={6}
                                        badge="New"
                                        badgeColor="text-gray-400 bg-gray-400/10 border-gray-400/20"
                                        status="Low Balance"
                                        statusColor="bg-orange-500"
                                        alert
                                    />
                                </div>
                            </section>

                            {/* SPENDING CHART & TABLE */}
                            <div className="grid md:grid-cols-2 gap-8">
                                <section className="bg-[#111113] border border-white/5 rounded-2xl p-5 flex flex-col">
                                    <h2 className="text-lg font-bold mb-6">Spending Overview (7d)</h2>
                                    <div className="flex-1 min-h-[250px] w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={MOCK_CHART_DATA} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                                <XAxis dataKey="day" stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} />
                                                <YAxis stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                                                <Tooltip
                                                    cursor={{ fill: '#ffffff05' }}
                                                    contentStyle={{ backgroundColor: '#111', borderColor: '#333', borderRadius: '8px' }}
                                                    itemStyle={{ fontSize: '13px' }}
                                                />
                                                <Bar dataKey="travel" stackId="a" fill="#c084fc" radius={[0, 0, 4, 4]} />
                                                <Bar dataKey="research" stackId="a" fill="#22d3ee" />
                                                <Bar dataKey="content" stackId="a" fill="#fb923c" radius={[4, 4, 0, 0]} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </section>

                                <section className="bg-[#111113] border border-white/5 rounded-2xl p-5 flex flex-col">
                                    <div className="flex items-center justify-between mb-4">
                                        <h2 className="text-lg font-bold">Top Services</h2>
                                        <button className="text-gray-400 hover:text-white"><MoreVertical className="w-5 h-5" /></button>
                                    </div>
                                    <div className="overflow-x-auto flex-1">
                                        <table className="w-full text-sm text-left">
                                            <thead className="text-xs text-gray-500 uppercase bg-[#0a0a0c] border-y border-white/5">
                                                <tr>
                                                    <th className="px-4 py-3 font-medium">Service</th>
                                                    <th className="px-4 py-3 font-medium">Category</th>
                                                    <th className="px-4 py-3 font-medium text-right">Cost</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-white/5">
                                                {MOCK_SERVICES.map((srv, idx) => (
                                                    <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                                                        <td className="px-4 py-3 font-medium text-white">{srv.service}</td>
                                                        <td className="px-4 py-3 text-gray-400">{srv.category}</td>
                                                        <td className="px-4 py-3 text-right font-mono text-cyan-400">{srv.cost}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </section>
                            </div>

                        </div>

                        {/* RIGHT COLUMN: LIVE FEED */}
                        <div className="lg:col-span-1">
                            <section className="bg-[#111113] border border-white/5 rounded-2xl p-5 h-full flex flex-col relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-cyan-400 to-purple-600" />

                                <div className="flex items-center justify-between mb-6 pt-2">
                                    <h2 className="text-lg font-bold flex items-center gap-2">
                                        Network Feed
                                    </h2>
                                    <div className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-green-500/10 border border-green-500/20">
                                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                                        <span className="text-[10px] font-bold text-green-500 uppercase tracking-wider">Live</span>
                                    </div>
                                </div>

                                <NetworkFeed />

                            </section>
                        </div>
                    </div>
                </div>
            </main>

            {/* MOBILE BOTTOM TABS */}
            <div className="md:hidden fixed bottom-0 w-full bg-[#0a0a0c]/90 backdrop-blur-xl border-t border-white/10 z-50 px-6 py-4 pb-safe flex justify-between items-center">
                <MobileTab icon={<Home className="w-6 h-6" />} active={activeTab === "dashboard"} onClick={() => setActiveTab("dashboard")} />
                <MobileTab icon={<Bot className="w-6 h-6" />} active={activeTab === "agents"} onClick={() => setActiveTab("agents")} />
                <div className="relative -top-6">
                    <button className="w-14 h-14 bg-gradient-to-br from-purple-600 to-cyan-400 rounded-full flex items-center justify-center shadow-[0_4px_20px_rgba(168,85,247,0.4)] text-white hover:scale-105 transition-transform" onClick={() => setActiveTab("market")}>
                        <Store className="w-6 h-6" />
                    </button>
                </div>
                <MobileTab icon={<BarChart2 className="w-6 h-6" />} active={activeTab === "analytics"} onClick={() => setActiveTab("analytics")} />
                <MobileTab icon={<Settings className="w-6 h-6" />} active={activeTab === "settings"} onClick={() => setActiveTab("settings")} />
            </div>
        </div>
    );
}

// Sub components

function NavItem({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${active
                ? "bg-white/10 text-white"
                : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
        >
            <div className={`${active ? "text-cyan-400" : "text-gray-400"}`}>{icon}</div>
            {label}
        </button>
    );
}

function MobileTab({ icon, active, onClick }: { icon: React.ReactNode, active: boolean, onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className={`p-2 transition-colors ${active ? "text-cyan-400" : "text-gray-500 hover:text-gray-300"}`}
        >
            {icon}
        </button>
    );
}

function StatCard({ title, value, icon, trend }: { title: string, value: string, icon: React.ReactNode, trend: string }) {
    return (
        <div className="bg-[#111113] border border-white/5 p-5 rounded-2xl hover:border-white/10 transition-colors group">
            <div className="flex justify-between items-start mb-4">
                <p className="text-gray-400 text-sm font-medium">{title}</p>
                <div className="p-2 rounded-lg bg-white/5 group-hover:scale-110 transition-transform">{icon}</div>
            </div>
            <h3 className="text-2xl font-bold tracking-tight text-white mb-2">{value}</h3>
            <p className="text-xs text-gray-500">{trend}</p>
        </div>
    );
}

interface AgentCardProps {
    name: string;
    balance: string;
    budget: string;
    txs: number;
    badge: string;
    badgeColor: string;
    status: string;
    statusColor: string;
    alert?: boolean;
}

function AgentCard({ name, balance, budget, txs, badge, badgeColor, status, statusColor, alert }: AgentCardProps) {
    return (
        <div className={`relative bg-[#111113] border p-5 rounded-2xl flex flex-col justify-between ${alert ? "border-orange-500/30" : "border-white/5"} hover:border-purple-500/30 transition-colors`}>
            {alert && <div className="absolute top-0 right-0 w-16 h-16 bg-orange-500/10 rounded-tr-2xl rounded-bl-full" />}

            <div className="mb-4">
                <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                            <Bot className="w-4 h-4 text-white" />
                        </div>
                        <h3 className="font-bold text-white leading-tight">{name}</h3>
                    </div>
                </div>
                <div className={`inline-flex px-2 py-0.5 rounded border text-[10px] font-bold uppercase tracking-wider ${badgeColor}`}>
                    {badge}
                </div>
            </div>

            <div className="space-y-3 mb-4 flex-1">
                <div>
                    <p className="text-xs text-gray-500 mb-1">Balance</p>
                    <p className="text-lg font-mono text-cyan-400">{balance} USDC</p>
                </div>
                <div>
                    <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-500">Daily Budget</span>
                        <span className="text-gray-400">{parseFloat(balance) > parseFloat(budget) ? budget : balance} / {budget}</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                        <div
                            className={`h-full rounded-full ${alert ? 'bg-orange-500' : 'bg-purple-500'}`}
                            style={{ width: `${Math.min((parseFloat(balance) / parseFloat(budget)) * 100, 100)}%` }}
                        />
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <div className="flex items-center gap-2 text-xs">
                    <div className={`w-2 h-2 rounded-full ${statusColor}`} />
                    <span className="text-gray-400">{status}</span>
                </div>
                <div className="text-xs text-gray-500">
                    <span className="text-white">{txs}</span> TXs today
                </div>
            </div>
        </div>
    );
}

function NetworkFeed() {
    const [feed, setFeed] = useState(MOCK_ACTIVITY);

    useEffect(() => {
        // Simulate real-time data incoming from Soroban SSE
        const intervals = setInterval(() => {
            setFeed(prev => {
                const item = prev[Math.floor(Math.random() * prev.length)];
                const newItem = {
                    ...item,
                    id: Date.now(),
                    time: "Just now",
                    amount: (Math.random() * 0.005).toFixed(4),
                };
                const updated = [newItem, ...prev].slice(0, 6);
                return updated.map(x => {
                    if (x.time === "Just now" && x.id !== newItem.id) return { ...x, time: "2s ago" };
                    if (x.time === "2s ago") return { ...x, time: "5s ago" };
                    return x;
                });
            });
        }, 3500);
        return () => clearInterval(intervals);
    }, []);

    return (
        <div className="flex-1 overflow-y-auto pr-2 -mr-2 space-y-3 font-mono text-xs">
            <AnimatePresence initial={false}>
                {feed.map((tx) => (
                    <motion.div
                        key={tx.id}
                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex flex-col p-3 rounded-xl bg-black/40 border border-white/5 hover:border-white/10 transition-colors"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <span className={`${tx.color} font-medium tracking-tight`}>{tx.agent}</span>
                            <span className="text-gray-500">{tx.time}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5 text-gray-400">
                                <ArrowRight className="w-3 h-3 text-white/40" />
                                <span>{tx.service}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="text-white">${tx.amount}</span>
                                <CheckCircle2 className="w-3 h-3 text-cyan-400" />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}
