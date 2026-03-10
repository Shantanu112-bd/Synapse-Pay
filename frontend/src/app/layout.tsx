import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ToastProvider";
import { WalletProvider } from "@/context/WalletContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SynapsPay - The Financial Nervous System for AI",
  description: "Give your AI agents their own wallet to autonomously pay for APIs, compute, and services.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className={`${inter.className} antialiased selection:bg-purple-500/30`}>
        <ToastProvider>
          <WalletProvider>
            {children}
          </WalletProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
