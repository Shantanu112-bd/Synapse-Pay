"use client";

export function AgentCardSkeleton() {
    return (
        <div className="bg-[#111113] border border-white/5 rounded-2xl p-5 animate-pulse space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/5" />
                    <div className="space-y-1.5">
                        <div className="h-3.5 w-24 bg-white/5 rounded-full" />
                        <div className="h-2.5 w-16 bg-white/5 rounded-full" />
                    </div>
                </div>
                <div className="h-5 w-14 bg-white/5 rounded-full" />
            </div>
            <div className="grid grid-cols-3 gap-3">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="bg-black/30 rounded-xl p-3 space-y-1.5">
                        <div className="h-2 w-10 bg-white/5 rounded-full" />
                        <div className="h-3.5 w-14 bg-white/5 rounded-full" />
                    </div>
                ))}
            </div>
            <div className="h-1.5 bg-white/5 rounded-full" />
            <div className="flex gap-2">
                <div className="h-8 flex-1 bg-white/5 rounded-lg" />
                <div className="h-8 flex-1 bg-white/5 rounded-lg" />
                <div className="h-8 w-8 bg-white/5 rounded-lg" />
            </div>
        </div>
    );
}

export function ServiceCardSkeleton() {
    return (
        <div className="bg-[#111113] border border-white/5 rounded-2xl p-5 animate-pulse space-y-4">
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/5" />
                    <div className="space-y-1.5">
                        <div className="h-3.5 w-28 bg-white/5 rounded-full" />
                        <div className="h-2.5 w-16 bg-white/5 rounded-full" />
                    </div>
                </div>
                <div className="h-5 w-12 bg-white/5 rounded-full" />
            </div>
            <div className="space-y-1.5">
                <div className="h-2.5 w-full bg-white/5 rounded-full" />
                <div className="h-2.5 w-4/5 bg-white/5 rounded-full" />
            </div>
            <div className="grid grid-cols-2 gap-3">
                <div className="bg-black/30 rounded-xl p-3 space-y-1.5">
                    <div className="h-2 w-10 bg-white/5 rounded-full" />
                    <div className="h-3.5 w-16 bg-white/5 rounded-full" />
                </div>
                <div className="bg-black/30 rounded-xl p-3 space-y-1.5">
                    <div className="h-2 w-10 bg-white/5 rounded-full" />
                    <div className="h-3.5 w-16 bg-white/5 rounded-full" />
                </div>
            </div>
            <div className="h-9 bg-white/5 rounded-xl" />
        </div>
    );
}

export function TransactionRowSkeleton() {
    return (
        <div className="flex items-center gap-4 p-4 animate-pulse">
            <div className="w-9 h-9 rounded-full bg-white/5 shrink-0" />
            <div className="flex-1 space-y-1.5">
                <div className="h-3 w-32 bg-white/5 rounded-full" />
                <div className="h-2.5 w-20 bg-white/5 rounded-full" />
            </div>
            <div className="h-3.5 w-16 bg-white/5 rounded-full" />
        </div>
    );
}
