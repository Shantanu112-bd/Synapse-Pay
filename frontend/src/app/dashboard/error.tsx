"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

export default function ErrorBoundary({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="flex h-screen w-full flex-col items-center justify-center bg-[#0a0a0c] p-6 text-center">
            <div className="bg-[#111] border border-red-500/20 p-8 rounded-3xl max-w-lg w-full vector-pattern">
                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <AlertTriangle className="w-8 h-8 text-red-500" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Connection Lost</h2>
                <p className="text-gray-400 mb-8">
                    Unable to synchronize with the SynapsPay agent network. Please verify your connection or try restarting the synchronization sequence.
                </p>
                <button
                    onClick={() => reset()}
                    className="bg-white text-black px-6 py-3 rounded-full font-semibold hover:bg-gray-200 transition-colors inline-flex items-center gap-2"
                >
                    <RotateCcw className="w-4 h-4" />
                    Retry Connection
                </button>
            </div>
        </div>
    );
}
