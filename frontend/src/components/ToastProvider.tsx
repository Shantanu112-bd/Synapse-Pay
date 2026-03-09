"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertTriangle, Info, X, BellRing } from "lucide-react";

type ToastType = "success" | "error" | "warning" | "info";

interface Toast {
    id: string;
    message: string;
    type: ToastType;
    subtext?: string;
}

interface ToastContextValue {
    showToast: (message: string, type?: ToastType, subtext?: string) => void;
}

const ToastContext = createContext<ToastContextValue>({ showToast: () => { } });

export function useToast() {
    return useContext(ToastContext);
}

const ICONS: Record<ToastType, React.ReactNode> = {
    success: <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />,
    error: <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />,
    warning: <BellRing className="w-4 h-4 text-orange-400 shrink-0" />,
    info: <Info className="w-4 h-4 text-cyan-400 shrink-0" />,
};

const BORDER_COLORS: Record<ToastType, string> = {
    success: "border-emerald-500/30",
    error: "border-red-500/30",
    warning: "border-orange-500/30",
    info: "border-cyan-500/30",
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback(
        (message: string, type: ToastType = "info", subtext?: string) => {
            const id = Math.random().toString(36).slice(2);
            setToasts((prev) => [...prev, { id, message, type, subtext }]);
            setTimeout(() => {
                setToasts((prev) => prev.filter((t) => t.id !== id));
            }, 4500);
        },
        []
    );

    const dismiss = (id: string) =>
        setToasts((prev) => prev.filter((t) => t.id !== id));

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {/* Toast container */}
            <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
                <AnimatePresence mode="popLayout">
                    {toasts.map((toast) => (
                        <motion.div
                            key={toast.id}
                            layout
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 60, scale: 0.95 }}
                            transition={{ type: "spring", stiffness: 400, damping: 30 }}
                            className={`pointer-events-auto flex items-start gap-3 bg-[#111113]/95 backdrop-blur-xl border ${BORDER_COLORS[toast.type]} rounded-2xl px-4 py-3 shadow-2xl max-w-xs`}
                        >
                            {ICONS[toast.type]}
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white leading-snug">{toast.message}</p>
                                {toast.subtext && (
                                    <p className="text-xs text-gray-400 mt-0.5 leading-snug">{toast.subtext}</p>
                                )}
                            </div>
                            <button
                                onClick={() => dismiss(toast.id)}
                                className="text-gray-600 hover:text-gray-300 transition-colors"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
}
