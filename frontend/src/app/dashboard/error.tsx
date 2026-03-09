"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";
import Link from "next/link";

export default function ErrorBoundary({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("[SynapsPay] Dashboard error:", error);
    }, [error]);

    return (
        <div className="flex h-screen w-full items-center justify-center bg-[#0a0a0c] px-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center gap-6 text-center max-w-md w-full"
            >
                <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                    <AlertTriangle className="w-8 h-8 text-red-400" />
                </div>

                <div>
                    <h1 className="text-2xl font-bold text-white mb-2">Something went wrong</h1>
                    <p className="text-gray-400 text-sm leading-relaxed">
                        The dashboard encountered an unexpected error. This may be a temporary network issue or a problem connecting to the Stellar testnet.
                    </p>
                    {error.digest && (
                        <p className="text-xs text-gray-600 mt-3 font-mono">Error ID: {error.digest}</p>
                    )}
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={reset}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-black font-semibold text-sm hover:bg-gray-200 transition-colors"
                    >
                        <RotateCcw className="w-4 h-4" />
                        Try Again
                    </button>
                    <Link
                        href="/"
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-semibold text-sm hover:bg-white/10 transition-colors"
                    >
                        <Home className="w-4 h-4" />
                        Go Home
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
