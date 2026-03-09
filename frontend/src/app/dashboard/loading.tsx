"use client";

export default function Loading() {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-[#0a0a0c]">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 rounded-full border-4 border-purple-500/20 border-t-purple-500 animate-spin" />
                <p className="text-gray-400 font-mono text-sm animate-pulse">Establishing secure agent link...</p>
            </div>
        </div>
    );
}
