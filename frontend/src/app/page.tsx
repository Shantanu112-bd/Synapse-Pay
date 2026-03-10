"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Wallet,
  Zap,
  Globe,
  ShieldCheck,
  Percent,
  Cpu,
  ArrowRight,
  Menu,
  X,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";

export default function SynapsPayLanding() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white selection:bg-purple-500/30 overflow-hidden neural-bg">
      {/* NAVBAR */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled
          ? "bg-[#0a0a0c]/80 backdrop-blur-md border-b border-white/10"
          : "bg-transparent"
          }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-cyan-400 flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.4)]">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight hidden sm:block">SynapsPay</span>
            </div>
            {/* Testnet Badge */}
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/20">
              <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-bold text-orange-500 uppercase tracking-wider">Testnet</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
            <a href="#features" className="hover:text-white transition-colors">
              Features
            </a>
            <a href="#marketplace" className="hover:text-white transition-colors">
              Marketplace
            </a>
            <a href="#docs" className="hover:text-white transition-colors">
              Docs
            </a>
            <a href="#sdk" className="hover:text-white transition-colors">
              SDK
            </a>
          </div>

          <div className="hidden md:flex">
            <Link href="/dashboard" className="bg-white text-black px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-gray-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.1)]">
              Launch App
            </Link>
          </div>

          <button
            className="md:hidden text-gray-300"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-[#0a0a0c]/95 backdrop-blur-xl pt-24 px-6 md:hidden">
          <div className="flex flex-col gap-6 text-lg">
            <a href="#features" onClick={() => setMobileMenuOpen(false)}>Features</a>
            <a href="#marketplace" onClick={() => setMobileMenuOpen(false)}>Marketplace</a>
            <a href="#docs" onClick={() => setMobileMenuOpen(false)}>Docs</a>
            <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className="bg-white text-black text-center px-6 py-3 rounded-full font-semibold w-full mt-4">
              Launch App
            </Link>
          </div>
        </div>
      )
      }

      {/* HERO SECTION */}
      <section className="relative pt-40 pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm text-cyan-400 mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            Stellar Soroban Mainnet Live
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-tight">
            The Financial <br className="hidden md:block" />
            <span className="text-gradient">Nervous System</span> <br className="hidden md:block" />
            for AI Agents
          </h1>

          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Give your AI agents their own wallet. Let them autonomously pay for APIs, compute, and services. Settled instantly on the Stellar blockchain.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/dashboard" className="w-full sm:w-auto px-8 py-4 rounded-full bg-white text-black font-semibold hover:bg-gray-200 transition-all flex items-center justify-center gap-2 group shadow-[0_0_30px_rgba(255,255,255,0.15)]">
              Launch Dashboard
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/sandbox" className="w-full sm:w-auto px-8 py-4 flex items-center justify-center rounded-full bg-white/5 text-white font-semibold border border-white/10 hover:bg-white/10 transition-colors">
              Developer Sandbox
            </Link>
          </div>
        </motion.div>

        {/* LIVE DEMO TICKER / ANIMATION (Hero Bottom) */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="w-full max-w-md mt-20 relative"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-purple-500/20 to-cyan-500/20 blur-3xl rounded-full" />
          <div className="relative bg-gradient-glass rounded-2xl p-4 overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-2">
              <span className="text-xs text-gray-400 font-mono">LIVE_AGENT_FEED</span>
              <span className="text-xs text-cyan-400 flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" /> Running
              </span>
            </div>

            <LiveDemoFeed />

          </div>
        </motion.div>
      </section>

      {/* STATS BAR */}
      <section className="border-y border-white/5 bg-black/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-white/5 text-center">
            <div className="px-4">
              <div className="text-3xl font-bold text-white mb-1">5s</div>
              <div className="text-sm text-gray-500">Stellar Settlement</div>
            </div>
            <div className="px-4">
              <div className="text-3xl font-bold text-white mb-1">$0.00001</div>
              <div className="text-sm text-gray-500">Min. Transaction Fee</div>
            </div>
            <div className="px-4">
              <div className="text-3xl font-bold text-white mb-1">USDC</div>
              <div className="text-sm text-gray-500">Zero Volatility</div>
            </div>
            <div className="px-4">
              <div className="text-3xl font-bold text-white mb-1">Rust</div>
              <div className="text-sm text-gray-500">Soroban Contracts</div>
            </div>
          </div>
        </div>
      </section>

      {/* PROBLEM SECTION */}
      <section className="py-32 px-6 max-w-7xl mx-auto relative">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            AI agents are powerful but <br />
            <span className="text-gray-500">financially helpless.</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-[#111113] border border-white/5 p-8 rounded-3xl">
            <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center mb-6">
              <Wallet className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="text-xl font-bold mb-3">No Wallet</h3>
            <p className="text-gray-400 leading-relaxed">
              Agents rely on hardcoded developer API keys. They cannot hold balances, receive funds, or autonomously pay dependencies.
            </p>
          </div>
          <div className="bg-[#111113] border border-white/5 p-8 rounded-3xl">
            <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center mb-6">
              <Percent className="w-6 h-6 text-orange-500" />
            </div>
            <h3 className="text-xl font-bold mb-3">No Micropayments</h3>
            <p className="text-gray-400 leading-relaxed">
              Traditional payment rails like Stripe have a $0.50 minimum. You cannot pay $0.0002 for a single API call easily.
            </p>
          </div>
          <div className="bg-[#111113] border border-white/5 p-8 rounded-3xl">
            <div className="w-12 h-12 bg-yellow-500/10 rounded-xl flex items-center justify-center mb-6">
              <ShieldCheck className="w-6 h-6 text-yellow-500" />
            </div>
            <h3 className="text-xl font-bold mb-3">No Autonomy</h3>
            <p className="text-gray-400 leading-relaxed">
              Humans have to babysit agent transactions, approve budgets manually, and reconcile invoices at the end of the month.
            </p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-32 px-6 bg-black relative">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">How It Works</h2>
            <p className="text-gray-400 text-lg">Fully autonomous payments in 5 simple steps.</p>
          </div>

          <div className="space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/20 before:to-transparent">
            <StepItem number="1" title="Create Agent Wallet" desc="Deploy a Soroban smart contract wallet uniquely owned by your agent." />
            <StepItem number="2" title="Fund with USDC" desc="Load the agent's wallet with USDC stablecoin for zero-volatility spending." />
            <StepItem number="3" title="Discover Services" desc="Agent queries the on-chain Service Registry to find APIs and models." />
            <StepItem number="4" title="Trigger Auto-Micropayment" desc="Agent executes a sub-cent payment over Stellar to the service provider." />
            <StepItem number="5" title="Delivery & Logging" desc="Provider verifies payment, delivers the data, and logs the transaction on-chain." />
          </div>
        </div>
      </section>

      {/* FEATURES GRID */}
      <section className="py-32 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Everything an Agent Needs to Transact</h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard
            icon={<Wallet />}
            title="Programmable Wallets"
            desc="Every agent gets a dedicated Soroban contract tracking its balances and identity independently."
          />
          <FeatureCard
            icon={<Zap />}
            title="Micropayments"
            desc="Send as little as $0.0001 instantly without being crushed by traditional credit card processor limits."
          />
          <FeatureCard
            icon={<Globe />}
            title="Service Marketplace"
            desc="An on-chain registry of APIs, models, and data real-time searchable by operating autonomous agents."
          />
          <FeatureCard
            icon={<ShieldCheck />}
            title="Escrow Protection"
            desc="Funds are locked on-chain and only released once the data payload or service execution is verified."
          />
          <FeatureCard
            icon={<Cpu />}
            title="Budget Controls"
            desc="Set hard daily limits, whitelist approved vendors, and trigger emergency circuit breakers."
          />
          <FeatureCard
            icon={<Percent />}
            title="Revenue Sharing"
            desc="Automatically split incoming payments across collaborating agent swarms instantly."
          />
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 to-transparent" />
        <div className="max-w-4xl mx-auto text-center relative z-10 bg-gradient-glass border border-white/10 rounded-[3rem] p-12 md:p-20 shadow-2xl">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to empower your agents?</h2>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Integrate the SynapsPay SDK today and enable your AI models to autonomously buy, sell, and collaborate.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="px-8 py-4 rounded-full bg-white text-black font-semibold hover:bg-gray-200 transition-all flex items-center justify-center gap-2">
              Start Building Free
            </button>
            <button className="px-8 py-4 rounded-full bg-transparent text-white font-semibold border border-white/20 hover:bg-white/5 transition-colors">
              Read Documentation
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 bg-black pt-16 pb-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-purple-600 to-cyan-400 flex items-center justify-center">
              <Zap className="w-3 h-3 text-white" />
            </div>
            <span className="font-bold tracking-tight text-white">SynapsPay</span>
          </div>

          <div className="flex gap-8 text-sm text-gray-400">
            <a href="#" className="hover:text-white transition-colors">Documentation</a>
            <a href="#" className="hover:text-white transition-colors">SDK Reference</a>
            <a href="#" className="hover:text-white transition-colors">Marketplace</a>
            <a href="#" className="hover:text-white transition-colors">GitHub</a>
          </div>

          <div className="text-sm font-medium text-gray-500 flex items-center gap-2">
            Powered by <span className="text-white">Stellar</span>
          </div>
        </div>
      </footer>
    </div >
  );
}

// Sub-components
function LiveDemoFeed() {
  const [items, setItems] = useState([
    { id: 1, service: "WeatherAPI", amount: "0.0002" },
  ]);

  useEffect(() => {
    const services = [
      { service: "WeatherAPI", amount: "0.0002" },
      { service: "FlightsAPI", amount: "0.0005" },
      { service: "HotelsAI", amount: "0.0008" },
      { service: "MapsData", amount: "0.0001" },
    ];
    let index = 1;

    const interval = setInterval(() => {
      const next = services[index % services.length];
      setItems((prev) => {
        const newItems = [{ id: Date.now(), ...next }, ...prev];
        return newItems.slice(0, 3); // keep last 3
      });
      index++;
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-3 font-mono text-sm">
      {items.map((item, i) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, x: -20, height: 0 }}
          animate={{ opacity: 1 - (i * 0.3), x: 0, height: 'auto' }}
          className="flex items-center justify-between p-3 rounded-lg bg-black/40 border border-white/5"
        >
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center">
              <Cpu className="w-3 h-3 text-purple-400" />
            </div>
            <span className="text-gray-300">Paying {item.service}...</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-white font-medium">${item.amount}</span>
            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function StepItem({ number, title, desc }: { number: string, title: string, desc: string }) {
  return (
    <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
      {/* Icon */}
      <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-black bg-purple-600 text-white font-bold shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-[0_0_15px_rgba(128,90,213,0.5)] z-10">
        {number}
      </div>
      {/* Card */}
      <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-[#111113] border border-white/5 p-6 rounded-2xl hover:border-purple-500/30 transition-colors">
        <h4 className="text-xl font-bold text-white mb-2">{title}</h4>
        <p className="text-gray-400 leading-relaxed text-sm">{desc}</p>
      </div>
    </div>
  )
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="group relative bg-[#0a0a0c] p-8 rounded-3xl border border-white/10 hover:border-white/20 transition-all overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="relative z-10">
        <div className="w-12 h-12 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center mb-6 text-cyan-400 group-hover:scale-110 transition-transform shadow-lg">
          {icon}
        </div>
        <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
        <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
      </div>
    </div>
  )
}
