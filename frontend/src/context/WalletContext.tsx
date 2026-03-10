"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { connectFreighter, connectAlbedo, getWalletBalance, signTransaction as signTxWallet } from "@/lib/wallet";
import { useToast } from "@/components/ToastProvider";
import { useRouter } from "next/navigation";

export interface WalletState {
    publicKey: string | null;
    isConnected: boolean;
    xlmBalance: number;
    usdcBalance: number;
    network: string;
    walletType: "freighter" | "albedo" | null;
}

interface WalletContextType extends WalletState {
    connect: (type: "freighter" | "albedo") => Promise<void>;
    disconnect: () => void;
    refreshBalance: () => Promise<void>;
    signTransaction: (txXdr: string) => Promise<string>;
}

const WalletContext = createContext<WalletContextType | null>(null);

export function WalletProvider({ children }: { children: React.ReactNode }) {
    const { showToast } = useToast();
    const router = useRouter();
    const [state, setState] = useState<WalletState>({
        publicKey: null,
        isConnected: false,
        xlmBalance: 0,
        usdcBalance: 0,
        network: "TESTNET",
        walletType: null,
    });

    useEffect(() => {
        if (typeof window !== "undefined") {
            const data = localStorage.getItem("wallet_data");
            if (data) {
                const parsed = JSON.parse(data);
                setState(prev => ({ ...prev, ...parsed, isConnected: true }));
            }
        }
    }, []);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        if (state.publicKey) {
            refreshBalance(state.publicKey);
        }
    }, [state.publicKey]);

    const refreshBalance = async (pk = state.publicKey) => {
        if (!pk) return;
        const { xlm, usdc } = await getWalletBalance(pk);
        setState(prev => ({ ...prev, xlmBalance: xlm, usdcBalance: usdc }));
    };

    const connect = async (type: "freighter" | "albedo") => {
        try {
            let res;
            if (type === "freighter") {
                res = await connectFreighter();
            } else {
                res = await connectAlbedo();
            }

            const pk = typeof res.publicKey === "string" ? res.publicKey : ((res.publicKey as { address?: string })?.address || "");
            const newState = { publicKey: pk, network: res.network || "TESTNET", walletType: type as "freighter" | "albedo" };
            localStorage.setItem("wallet_data", JSON.stringify(newState));
            document.cookie = "wallet_connected=true; path=/; max-age=86400;";

            setState(prev => ({ ...prev, ...newState, isConnected: true }));
            await refreshBalance(pk);
            showToast("Wallet connected successfully!", "success");
        } catch (e: unknown) {
            showToast((e as Error).message || "Failed to connect wallet", "error");
            throw e;
        }
    };

    const disconnect = () => {
        localStorage.removeItem("wallet_data");
        document.cookie = "wallet_connected=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;";
        setState({
            publicKey: null,
            isConnected: false,
            xlmBalance: 0,
            usdcBalance: 0,
            network: "TESTNET",
            walletType: null,
        });
        showToast("Wallet disconnected", "info");
        router.push("/");
    };

    const signTransaction = async (txXdr: string) => {
        if (!state.publicKey || !state.walletType) throw new Error("Wallet not connected");
        return (await signTxWallet(txXdr, state.publicKey, state.walletType)) as string;
    };

    return (
        <WalletContext.Provider value={{ ...state, connect, disconnect, refreshBalance, signTransaction }}>
            {children}
        </WalletContext.Provider>
    );
}

export const useWallet = () => {
    const context = useContext(WalletContext);
    if (!context) throw new Error("useWallet must be used within WalletProvider");
    return context;
};
