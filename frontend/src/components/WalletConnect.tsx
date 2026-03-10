"use client";

import React, { useState } from "react";
import { useWallet } from "@/context/WalletContext";
import WalletModal from "./WalletModal";
import { ChevronDown, Copy, ExternalLink, LogOut, Wallet } from "lucide-react";
import { useToast } from "@/components/ToastProvider";

export function WalletConnect() {
    const { isConnected, publicKey, usdcBalance, xlmBalance, disconnect } = useWallet();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { showToast } = useToast();

    const formatAddress = (addr: string) => `${addr.slice(0, 4)}...${addr.slice(-4)}`;

    const copyAddress = () => {
        if (publicKey) navigator.clipboard.writeText(publicKey);
        showToast("Address copied!", "info");
    };

    if (!isConnected) {
        return (
            <>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-5 py-2.5 rounded-xl bg-white text-black font-semibold hover:bg-gray-200 transition-colors flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.1)] text-sm whitespace-nowrap"
                >
                    <Wallet className="w-4 h-4" />
                    Connect Wallet
                </button>
                {isModalOpen && <WalletModal onClose={() => setIsModalOpen(false)} />}
            </>
        );
    }

    return (
        <div className="relative">
            <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center gap-3 bg-[#111113] border border-white/10 px-4 py-2 rounded-xl hover:bg-white/5 transition-colors group"
            >
                <div className="relative flex h-2.5 w-2.5 shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                </div>
                <div className="flex flex-col items-start whitespace-nowrap">
                    <span className="font-mono text-xs text-gray-300 group-hover:text-white transition-colors">{publicKey ? formatAddress(publicKey) : ""}</span>
                    <span className="text-[10px] font-bold text-cyan-400">{usdcBalance.toFixed(2)} USDC</span>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isMenuOpen ? "rotate-180" : ""}`} />
            </button>

            {isMenuOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsMenuOpen(false)} />
                    <div className="absolute right-0 top-full mt-2 w-64 bg-[#111113] border border-white/10 rounded-2xl shadow-2xl p-4 z-50 overflow-hidden flex flex-col gap-2">
                        <div className="flex justify-between items-center bg-black/50 border border-white/5 rounded-xl p-3 mb-2">
                            <span className="font-mono text-xs text-gray-400">{publicKey ? formatAddress(publicKey) : ""}</span>
                            <button onClick={copyAddress} className="text-gray-400 hover:text-white transition-colors p-1">
                                <Copy className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="flex justify-between items-center text-sm px-2">
                            <span className="text-gray-500">USDC</span>
                            <span className="font-mono text-cyan-400 font-bold">{usdcBalance.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm px-2 mb-2">
                            <span className="text-gray-500">XLM</span>
                            <span className="font-mono text-white font-bold">{xlmBalance.toFixed(2)}</span>
                        </div>

                        <div className="border-t border-white/10 my-1" />

                        <a
                            href={`https://stellar.expert/explorer/testnet/account/${publicKey}`}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-2 text-xs text-gray-400 hover:text-white p-2 transition-colors rounded-lg hover:bg-white/5"
                        >
                            <ExternalLink className="w-3.5 h-3.5" /> View on Stellar Expert
                        </a>

                        <button
                            onClick={() => {
                                disconnect();
                                setIsMenuOpen(false);
                            }}
                            className="flex items-center gap-2 text-xs text-red-500 hover:text-red-400 p-2 transition-colors rounded-lg hover:bg-red-500/10 w-full"
                        >
                            <LogOut className="w-3.5 h-3.5" /> Disconnect Wallet
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

export default WalletConnect;
