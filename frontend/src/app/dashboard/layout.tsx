"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Home,
    Bot,
    Store,
    BarChart2,
    Settings,
    Zap,
} from "lucide-react";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    const tabs = [
        { id: "dashboard", href: "/dashboard", icon: <Home className="w-5 h-5" />, mobileIcon: <Home className="w-6 h-6" />, label: "Dashboard" },
        { id: "agents", href: "/dashboard/agents", icon: <Bot className="w-5 h-5" />, mobileIcon: <Bot className="w-6 h-6" />, label: "My Agents" },
        { id: "marketplace", href: "/dashboard/marketplace", icon: <Store className="w-5 h-5" />, mobileIcon: <Store className="w-6 h-6" />, label: "Marketplace" },
        { id: "analytics", href: "#", icon: <BarChart2 className="w-5 h-5" />, mobileIcon: <BarChart2 className="w-6 h-6" />, label: "Analytics" },
        { id: "settings", href: "#", icon: <Settings className="w-5 h-5" />, mobileIcon: <Settings className="w-6 h-6" />, label: "Settings" },
    ];

    return (
        <div className="flex h-screen bg-[#0a0a0c] text-white overflow-hidden font-sans selection:bg-purple-500/30">
            {/* DESKTOP SIDEBAR */}
            <aside className="hidden md:flex flex-col w-64 border-r border-white/10 bg-[#0a0a0c] z-20">
                <Link href="/" className="h-20 flex items-center px-6 border-b border-white/10 hover:bg-white/5 transition-colors">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-cyan-400 flex items-center justify-center shadow-lg">
                            <Zap className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-bold text-lg tracking-tight">SynapsPay</span>
                    </div>
                </Link>

                <nav className="flex-1 py-8 px-4 space-y-2">
                    {tabs.map((tab) => {
                        const active = pathname === tab.href;
                        return (
                            <Link
                                key={tab.id}
                                href={tab.href}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${active
                                        ? "bg-white/10 text-white"
                                        : "text-gray-400 hover:text-white hover:bg-white/5"
                                    }`}
                            >
                                <div className={`${active ? "text-cyan-400" : "text-gray-400"}`}>{tab.icon}</div>
                                {tab.label}
                            </Link>
                        );
                    })}
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
                {children}
            </main>

            {/* MOBILE BOTTOM TABS */}
            <div className="md:hidden fixed bottom-0 w-full bg-[#0a0a0c]/90 backdrop-blur-xl border-t border-white/10 z-50 px-6 py-4 pb-safe flex justify-between items-center">
                <Link href={tabs[0].href} className={`p-2 transition-colors ${pathname === tabs[0].href ? "text-cyan-400" : "text-gray-500 hover:text-gray-300"}`}>
                    {tabs[0].mobileIcon}
                </Link>
                <Link href={tabs[1].href} className={`p-2 transition-colors ${pathname === tabs[1].href ? "text-cyan-400" : "text-gray-500 hover:text-gray-300"}`}>
                    {tabs[1].mobileIcon}
                </Link>

                <div className="relative -top-6">
                    <Link href={tabs[2].href} className="w-14 h-14 bg-gradient-to-br from-purple-600 to-cyan-400 rounded-full flex items-center justify-center shadow-[0_4px_20px_rgba(168,85,247,0.4)] text-white hover:scale-105 transition-transform">
                        {tabs[2].mobileIcon}
                    </Link>
                </div>

                <Link href={tabs[3].href} className={`p-2 transition-colors ${pathname === tabs[3].href ? "text-cyan-400" : "text-gray-500 hover:text-gray-300"}`}>
                    {tabs[3].mobileIcon}
                </Link>
                <Link href={tabs[4].href} className={`p-2 transition-colors ${pathname === tabs[4].href ? "text-cyan-400" : "text-gray-500 hover:text-gray-300"}`}>
                    {tabs[4].mobileIcon}
                </Link>
            </div>
        </div>
    );
}
