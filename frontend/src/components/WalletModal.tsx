"use client";

import React, { useState } from "react";
import { useWallet } from "@/context/WalletContext";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ChevronRight, Globe, Loader2, Plug, X } from "lucide-react";

interface WalletModalProps {
    onClose: () => void;
}

type Step = "select" | "connecting" | "success";

export default function WalletModal({ onClose }: WalletModalProps) {
    const { connect, publicKey, xlmBalance, usdcBalance, network } = useWallet();
    const [step, setStep] = useState<Step>("select");
    const [errorMsg, setErrorMsg] = useState("");

    const handleConnect = async (type: "freighter" | "albedo") => {
        setStep("connecting");
        setErrorMsg("");
        try {
            await connect(type);
            setStep("success");
        } catch (e: unknown) {
            setErrorMsg((e as Error).message || "Failed to connect.");
            setStep("select");
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
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
                className="relative w-full max-w-md bg-[#111113] border border-white/10 rounded-3xl shadow-2xl z-10 overflow-hidden"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/10">
                    <h2 className="text-xl font-bold text-white tracking-tight">Connect Your Wallet</h2>
                    <button onClick={onClose} className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors">
                        <X className="w-5 h-5 text-gray-400" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    <AnimatePresence mode="wait">
                        {step === "select" && (
                            <motion.div
                                key="select"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="space-y-4"
                            >
                                {errorMsg && (
                                    <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl mb-4 text-center">
                                        {errorMsg}
                                    </div>
                                )}

                                <button
                                    onClick={() => handleConnect("freighter")}
                                    className="w-full flex items-center justify-between p-4 bg-black border border-white/5 rounded-2xl hover:bg-white/5 hover:border-purple-500/30 transition-all group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                                            <Plug className="w-6 h-6" />
                                        </div>
                                        <div className="text-left">
                                            <h3 className="text-white font-bold text-lg mb-0.5">Freighter</h3>
                                            <span className="text-xs text-gray-500">Browser Extension • Popular</span>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" />
                                </button>

                                <button
                                    onClick={() => handleConnect("albedo")}
                                    className="w-full flex items-center justify-between p-4 bg-black border border-white/5 rounded-2xl hover:bg-white/5 hover:border-cyan-500/30 transition-all group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-cyan-500/10 rounded-xl flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                                            <Globe className="w-6 h-6" />
                                        </div>
                                        <div className="text-left">
                                            <h3 className="text-white font-bold text-lg mb-0.5">Albedo</h3>
                                            <span className="text-xs text-gray-500">Web-based • No install</span>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" />
                                </button>

                                <div className="mt-8 pt-4 border-t border-white/5 text-center">
                                    <p className="text-xs text-gray-500 mb-2">New to Stellar wallets?</p>
                                    <a
                                        href="https://www.freighter.app"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm font-medium text-cyan-400 hover:text-cyan-300 transition-colors"
                                    >
                                        Get Freighter →
                                    </a>
                                </div>
                            </motion.div>
                        )}

                        {step === "connecting" && (
                            <motion.div
                                key="connecting"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                className="py-12 flex flex-col items-center text-center"
                            >
                                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-6 relative">
                                    <Loader2 className="w-8 h-8 text-cyan-400 animate-spin absolute" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">Connecting...</h3>
                                <p className="text-gray-400 text-sm">
                                    Check your browser extension or popup for approval.
                                </p>
                            </motion.div>
                        )}

                        {step === "success" && (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex flex-col items-center text-center"
                            >
                                <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-6">
                                    <CheckCircle2 className="w-8 h-8 text-green-500" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-6">Wallet Connected!</h3>

                                <div className="w-full bg-black border border-white/5 rounded-2xl p-4 mb-6 text-left space-y-3">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-500">Address</span>
                                        <span className="font-mono text-white">{publicKey?.slice(0, 4)}...{publicKey?.slice(-4)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-500">XLM Balance</span>
                                        <span className="font-mono text-cyan-400 font-bold">{xlmBalance.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-500">USDC Balance</span>
                                        <span className="font-mono text-cyan-400 font-bold">{usdcBalance.toFixed(2)}</span>
                                    </div>
                                    <div className="border-t border-white/10 my-2" />
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-gray-500">Network</span>
                                        <span className="uppercase text-green-400">{network}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={onClose}
                                    className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 font-bold text-white hover:opacity-90 transition-opacity"
                                >
                                    Go to Dashboard
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
}
