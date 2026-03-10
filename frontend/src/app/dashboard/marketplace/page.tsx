"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ServiceCardSkeleton } from "@/components/Skeletons";
import { useToast } from "@/components/ToastProvider";
import { AGENT_TEMPLATES, AgentTemplate } from "@/agents/templates";
import {
    Search, Filter, ArrowUpDown, DollarSign, ShieldCheck, Clock,
    CloudLightning, Plane, Building, Map, Newspaper, BrainCircuit,
    Zap, Code2, CheckCircle2, Plus, Bot, Star, Play, X
} from "lucide-react";

// --- MOCK DATA ---
const CATEGORIES = ["All", "Weather", "Flights", "Hotels", "Maps", "Data", "AI Models", "Compute"];

const MOCK_SERVICES = [
    { id: 1, name: "WeatherAPI Pro", desc: "Real-time global weather data and predictive forecasts.", price: 0.0002, category: "Weather", calls: 125034, trust: "Verified", time: "120ms", icon: CloudLightning },
    { id: 2, name: "FlightSearch AI", desc: "Live flight prices, dynamic routing, and availability.", price: 0.0005, category: "Flights", calls: 89342, trust: "Trusted", time: "250ms", icon: Plane },
    { id: 3, name: "HotelFinder", desc: "Global hotel metadata, pricing, and algorithmic recommendations.", price: 0.0008, category: "Hotels", calls: 67210, trust: "New", time: "300ms", icon: Building },
    { id: 4, name: "MapRoutes", desc: "Geographic routing, live traffic data, and map integration.", price: 0.0001, category: "Maps", calls: 245000, trust: "Verified", time: "80ms", icon: Map },
    { id: 5, name: "NewsDataFeed", desc: "Curated real-time news articles and geopolitical metadata.", price: 0.0003, category: "Data", calls: 156890, trust: "Trusted", time: "180ms", icon: Newspaper },
    { id: 6, name: "GPT Analysis", desc: "Large language model structural logic and advanced text analysis.", price: 0.002, category: "AI Models", calls: 23104, trust: "Verified", time: "850ms", icon: BrainCircuit },
];

export default function MarketplacePage() {
    const { showToast } = useToast();

    // Tabs state
    const [activeViewTab, setActiveViewTab] = useState<"agents" | "services">("agents");

    // Service Filters
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All");
    const [sort, setSort] = useState("Most Used");
    const [isLoading, setIsLoading] = useState(true);

    // AI Agents deploy modal
    const [deployingAgent, setDeployingAgent] = useState<AgentTemplate | null>(null);
    const [deployName, setDeployName] = useState("");
    const [deployFunds, setDeployFunds] = useState("5.00");

    useEffect(() => {
        setIsLoading(true);
        const t = setTimeout(() => setIsLoading(false), 800);
        return () => clearTimeout(t);
    }, [activeViewTab]);

    // Filtering Logic for Services
    let filteredServices = [...MOCK_SERVICES];
    if (category !== "All") filteredServices = filteredServices.filter(s => s.category === category);
    if (search.trim() !== "") {
        const q = search.toLowerCase();
        filteredServices = filteredServices.filter(s => s.name.toLowerCase().includes(q) || s.desc.toLowerCase().includes(q));
    }
    if (sort === "Price: Low to High") filteredServices.sort((a, b) => a.price - b.price);
    else if (sort === "Price: High to Low") filteredServices.sort((a, b) => b.price - a.price);
    else if (sort === "Most Used") filteredServices.sort((a, b) => b.calls - a.calls);
    else if (sort === "Newest") filteredServices.sort((a, b) => b.id - a.id);

    // Filtering for Agents
    let filteredAgents = [...AGENT_TEMPLATES];
    if (search.trim() !== "") {
        const q = search.toLowerCase();
        filteredAgents = filteredAgents.filter(a => a.name.toLowerCase().includes(q) || a.description.toLowerCase().includes(q));
    }

    const handleRegisterService = (e: React.FormEvent) => {
        e.preventDefault();
        showToast("Service submitted to network registry!", "success", "Pending Soroban ledger confirmation");
        (e.target as HTMLFormElement).reset();
    };

    const handleDeployAgent = (e: React.FormEvent) => {
        e.preventDefault();
        showToast(`${deployName || deployingAgent?.name} Deployed!`, "success", `Funded with ${deployFunds} USDC`);
        setDeployingAgent(null);
        setDeployName("");
        setDeployFunds("5.00");
    };

    const IconMap: { [key: string]: React.ElementType } = {
        Weather: CloudLightning, Flights: Plane, Hotels: Building,
        Maps: Map, Data: Newspaper, "AI Models": BrainCircuit
    };

    return (
        <div className="max-w-7xl mx-auto p-6 md:p-8 relative min-h-screen space-y-8">

            {/* HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-white mb-1 flex items-center gap-3">
                        Marketplace
                        <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400 bg-cyan-400/10 px-2 py-0.5 rounded border border-cyan-400/20">On-Chain</span>
                    </h1>
                    <p className="text-sm text-gray-400">Deploy ready-to-use AI agents or integrate verifiable APIs.</p>
                </div>
            </div>

            {/* TAB SWITCHER */}
            <div className="flex p-1 bg-[#111113] border border-white/5 rounded-2xl w-fit">
                <button
                    onClick={() => setActiveViewTab("agents")}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeViewTab === "agents" ? "bg-white/10 text-white shadow-sm" : "text-gray-400 hover:text-gray-300 hover:bg-white/5"
                        }`}
                >
                    <Bot className="w-4 h-4" /> AI Agents
                </button>
                <button
                    onClick={() => setActiveViewTab("services")}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeViewTab === "services" ? "bg-white/10 text-white shadow-sm" : "text-gray-400 hover:text-gray-300 hover:bg-white/5"
                        }`}
                >
                    <Code2 className="w-4 h-4" /> APIs & Services
                </button>
            </div>

            {/* SEARCH & FILTER BAR (Shared) */}
            <div className="bg-[#111113] border border-white/5 rounded-2xl p-4 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                        type="text"
                        placeholder={activeViewTab === "agents" ? "Search AI agents..." : "Search services and APIs..."}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-black border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors"
                    />
                </div>
                {activeViewTab === "services" && (
                    <div className="flex gap-4">
                        <div className="relative">
                            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="appearance-none bg-black border border-white/10 rounded-xl pl-10 pr-8 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors cursor-pointer"
                            >
                                {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                        </div>
                        <div className="relative">
                            <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                            <select
                                value={sort}
                                onChange={(e) => setSort(e.target.value)}
                                className="appearance-none bg-black border border-white/10 rounded-xl pl-10 pr-8 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors cursor-pointer"
                            >
                                <option value="Most Used">Most Used</option>
                                <option value="Price: Low to High">Price: Low to High</option>
                                <option value="Price: High to Low">Price: High to Low</option>
                                <option value="Newest">Newest</option>
                            </select>
                        </div>
                    </div>
                )}
            </div>

            {/* RENDERING AGENTS TAB */}
            {activeViewTab === "agents" && (
                <div>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold">Deployable AI Agents</h2>
                        <span className="text-sm text-gray-500">{isLoading ? "…" : `${filteredAgents.length} Agents Available`}</span>
                    </div>

                    {isLoading ? (
                        <div className="grid lg:grid-cols-2 gap-6">
                            {[...Array(4)].map((_, i) => <ServiceCardSkeleton key={i} />)}
                        </div>
                    ) : (
                        <div className="grid lg:grid-cols-2 gap-6">
                            <AnimatePresence>
                                {filteredAgents.map(agent => (
                                    <motion.div
                                        key={agent.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-[#111113] border border-white/5 rounded-3xl p-6 hover:border-purple-500/30 transition-colors flex flex-col group relative"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl pointer-events-none" />

                                        <div className="flex justify-between items-start mb-4 relative z-10">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border border-white/10 flex items-center justify-center text-white shadow-lg">
                                                    <Bot className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-lg text-white leading-tight">{agent.name}</h3>
                                                    <div className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mt-1 border border-cyan-400/20 bg-cyan-400/10 px-2 py-0.5 rounded inline-block">
                                                        {agent.category}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1 bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 px-2 py-1 rounded text-xs font-bold">
                                                <Star className="w-3 h-3 fill-yellow-400" />
                                                {agent.rating}
                                            </div>
                                        </div>

                                        <p className="text-sm text-gray-400 leading-relaxed mb-4 min-h-[40px] relative z-10">
                                            {agent.description}
                                        </p>

                                        <div className="bg-black/50 border border-white/5 rounded-xl p-4 mb-4 font-mono text-xs relative z-10">
                                            <div className="mb-2">
                                                <span className="text-gray-500 mr-2">{"->"} Input:</span>
                                                <span className="text-green-400 break-all">{agent.exampleInput}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-500 mr-2">{"<-"} Output:</span>
                                                <span className="text-purple-400 break-all">{agent.exampleOutput}</span>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-2 mb-6 relative z-10">
                                            {agent.usesApis.map(api => (
                                                <span key={api} className="bg-white/5 border border-white/10 px-2 py-1 rounded text-[10px] text-gray-300 uppercase tracking-wide flex items-center gap-1">
                                                    <Zap className="w-3 h-3 text-cyan-400" /> {api}
                                                </span>
                                            ))}
                                        </div>

                                        <div className="mt-auto grid grid-cols-2 gap-4 items-center border-t border-white/5 pt-5 relative z-10">
                                            <div>
                                                <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Estimated Cost / Run</p>
                                                <p className="text-cyan-400 font-mono font-bold flex items-center gap-1">
                                                    {agent.estimatedCost}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => setDeployingAgent(agent)}
                                                className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white rounded-xl font-bold transition-all shadow-lg text-sm"
                                            >
                                                Deploy Agent <Plus className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            )}

            {/* RENDERING SERVICES TAB */}
            {activeViewTab === "services" && (
                <div>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold">Featured Services</h2>
                        <span className="text-sm text-gray-500">{isLoading ? "…" : `${filteredServices.length} Results`}</span>
                    </div>

                    {isLoading ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[...Array(6)].map((_, i) => <ServiceCardSkeleton key={i} />)}
                        </div>
                    ) : filteredServices.length === 0 ? (
                        <div className="text-center py-20 bg-[#111113] border border-dashed border-white/10 rounded-3xl">
                            <Search className="w-10 h-10 text-gray-600 mx-auto mb-4" />
                            <p className="text-gray-400">No services found matching your criteria.</p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <AnimatePresence>
                                {filteredServices.map((service) => {
                                    const Icon = IconMap[service.category] || Code2;
                                    return (
                                        <motion.div
                                            layout
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{ duration: 0.2 }}
                                            key={service.id}
                                            className="bg-[#111113] border border-white/5 rounded-3xl p-6 hover:border-purple-500/30 transition-colors flex flex-col group relative overflow-hidden"
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />

                                            <div className="relative z-10 flex-1">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-cyan-400 shadow-lg">
                                                        <Icon className="w-6 h-6" />
                                                    </div>
                                                    <div className="text-xs font-semibold text-gray-400 bg-black px-2.5 py-1 rounded border border-white/5 uppercase tracking-wider">
                                                        {service.category}
                                                    </div>
                                                </div>

                                                <h3 className="font-bold text-lg mb-2 leading-tight text-white">{service.name}</h3>
                                                <p className="text-sm text-gray-400 leading-relaxed mb-6 line-clamp-2 min-h-[40px]">
                                                    {service.desc}
                                                </p>

                                                <div className="grid grid-cols-2 gap-4 mb-6">
                                                    <div className="bg-black/50 border border-white/5 p-3 rounded-xl">
                                                        <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Price / Call</p>
                                                        <p className="font-mono text-cyan-400 font-bold flex items-center gap-1">
                                                            <DollarSign className="w-3 h-3 text-cyan-500" />
                                                            {service.price}
                                                        </p>
                                                    </div>
                                                    <div className="bg-black/50 border border-white/5 p-3 rounded-xl">
                                                        <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Total Calls</p>
                                                        <p className="font-mono text-white flex items-center gap-1">
                                                            <Zap className="w-3 h-3 text-purple-400" />
                                                            {service.calls.toLocaleString()}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-4 text-xs font-medium border-t border-white/5 pt-4">
                                                    <div className="flex items-center gap-1 text-gray-300">
                                                        <ShieldCheck className={`w-4 h-4 ${service.trust === 'Verified' ? 'text-blue-400' : 'text-gray-400'}`} />
                                                        {service.trust}
                                                    </div>
                                                    <div className="flex items-center gap-1 text-gray-300">
                                                        <Clock className="w-4 h-4 text-orange-400" />
                                                        {service.time}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="relative z-10 mt-6">
                                                <button
                                                    onClick={() => showToast(`${service.name} added to agent`, "success")}
                                                    className="w-full flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl font-semibold transition-colors uppercase tracking-widest text-xs"
                                                >
                                                    <Plus className="w-4 h-4" /> Add to Agent
                                                </button>
                                            </div>
                                        </motion.div>
                                    )
                                })}
                            </AnimatePresence>
                        </div>
                    )}

                    {/* REGISTER SERVICE FORM */}
                    <section className="mt-12 bg-gradient-to-br from-[#1a1033] to-[#0a0a0c] border border-purple-500/20 rounded-3xl p-8 md:p-12 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 blur-[100px] pointer-events-none" />

                        <div className="flex flex-col md:flex-row gap-12 relative z-10">
                            <div className="flex-1">
                                <h2 className="text-3xl font-bold tracking-tight mb-4">List your API on the network.</h2>
                                <p className="text-gray-400 mb-8 leading-relaxed">
                                    Monetize your models, data feeds, and computations instantly. SynapsPay handles all micropayments, escrows, and agent connections autonomously on the Stellar blockchain. No credit card processors. Zero minimums.
                                </p>

                                <div className="space-y-4 font-mono text-sm">
                                    <div className="flex items-center gap-3 text-cyan-400">
                                        <CheckCircle2 className="w-5 h-5" /> Instant USDC Settlement
                                    </div>
                                    <div className="flex items-center gap-3 text-cyan-400">
                                        <CheckCircle2 className="w-5 h-5" /> Cryptographic Escrow Protection
                                    </div>
                                    <div className="flex items-center gap-3 text-cyan-400">
                                        <CheckCircle2 className="w-5 h-5" /> Algorithmic Trust Scores
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 bg-black/60 backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-8">
                                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                                    <Code2 className="w-5 h-5 text-purple-400" /> API Registration Form
                                </h3>
                                <form onSubmit={handleRegisterService} className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-400 mb-1">Service Name</label>
                                            <input required type="text" className="w-full bg-[#111113] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500" placeholder="e.g. OpenAI GPT-4" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-400 mb-1">Category</label>
                                            <select className="w-full bg-[#111113] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500">
                                                {CATEGORIES.filter(c => c !== "All").map(cat => <option key={cat}>{cat}</option>)}
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-medium text-gray-400 mb-1">Description (Short)</label>
                                        <input required type="text" className="w-full bg-[#111113] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500" placeholder="A brief 1-2 line description..." />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-400 mb-1">Price per Call (USDC)</label>
                                            <div className="relative">
                                                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                                <input required type="number" step="0.0001" className="w-full bg-[#111113] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500 font-mono" placeholder="0.0001" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-400 mb-1">Endpoint API URL</label>
                                            <input required type="url" className="w-full bg-[#111113] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500 font-mono" placeholder="https://api..." />
                                        </div>
                                    </div>

                                    <div className="pt-4 mt-2">
                                        <button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-bold rounded-xl py-3 hover:opacity-90 transition-opacity flex justify-center items-center gap-2 shadow-[0_4px_20px_rgba(168,85,247,0.3)]">
                                            Deploy to Soroban Ledger
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </section>
                </div>
            )}

            {/* DEPLOY AGENT MODAL */}
            <AnimatePresence>
                {deployingAgent && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setDeployingAgent(null)}
                            className="absolute inset-0 bg-[#0a0a0c]/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-lg bg-[#111113] border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl"
                        >
                            <button
                                onClick={() => setDeployingAgent(null)}
                                className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center shadow-lg">
                                    <Bot className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">Deploy Agent</h3>
                                    <p className="text-sm text-cyan-400">{deployingAgent.name}</p>
                                </div>
                            </div>

                            <form onSubmit={handleDeployAgent} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Assign Name</label>
                                    <input
                                        required
                                        type="text"
                                        value={deployName}
                                        onChange={e => setDeployName(e.target.value)}
                                        placeholder={`e.g. My ${deployingAgent.name}`}
                                        className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Initial Agent Funding (USDC)</label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                        <input
                                            required
                                            type="number"
                                            step="0.1"
                                            value={deployFunds}
                                            onChange={e => setDeployFunds(e.target.value)}
                                            className="w-full bg-black border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white font-mono text-lg focus:outline-none focus:border-purple-500 transition-colors"
                                        />
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm border-l border-white/10 pl-4">
                                            From Stellar Wallet
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2">
                                        Estimated cost per run: <span className="text-cyan-400 font-mono">{deployingAgent.estimatedCost}</span>
                                    </p>
                                </div>

                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        className="w-full flex justify-center items-center gap-2 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-bold text-lg hover:opacity-90 transition-opacity shadow-[0_0_20px_rgba(168,85,247,0.3)]"
                                    >
                                        <Play className="w-5 h-5" /> Deploy to Network
                                    </button>
                                </div>
                            </form>

                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

        </div>
    );
}
