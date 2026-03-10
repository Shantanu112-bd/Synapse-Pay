import { isConnected, requestAccess, signTransaction as freighterSign, getNetwork } from "@stellar/freighter-api";
import albedo from "@albedo-link/intent";
import * as StellarSdk from "@stellar/stellar-sdk";

export async function connectFreighter() {
    if (await isConnected()) {
        const pk = await requestAccess();
        const network = await getNetwork();

        let networkName = typeof network === 'string' ? network : 'Unknown';
        if (networkName.toUpperCase().includes('TESTNET')) {
            networkName = 'TESTNET';
        }

        return { publicKey: pk, network: networkName };
    }
    throw new Error("Freighter not installed or access denied");
}

export async function connectAlbedo() {
    const res = await albedo.publicKey({});
    return {
        publicKey: res.pubkey,
        network: "TESTNET" // Albedo doesn't return network directly on publicKey intent usually, we assume Testnet for now
    };
}

export function disconnectWallet() {
    localStorage.removeItem("wallet_data");
    // Usually redirect is handled in the UI
}

export async function getWalletBalance(publicKey: string) {
    let xlm = 0;
    let usdc = 0;

    try {
        const server = new StellarSdk.Horizon.Server("https://horizon-testnet.stellar.org");
        const account = await server.loadAccount(publicKey);

        account.balances.forEach(b => {
            if (b.asset_type === "native") {
                xlm = parseFloat(b.balance);
            } else if ("asset_code" in b && b.asset_code === "USDC") {
                usdc = parseFloat(b.balance);
            }
        });
    } catch (e) {
        console.error("Error fetching balance:", e);
    }

    return { xlm, usdc };
}

export async function signTransaction(transactionXdr: string, publicKey: string, walletType: "freighter" | "albedo") {
    if (walletType === "freighter") {
        const res = await freighterSign(transactionXdr, { networkPassphrase: StellarSdk.Networks.TESTNET });
        if (typeof res === "string") return res;
        // Freighter v2 returns object with signedTxXdr
        return (res as { signedTxXdr?: string }).signedTxXdr ?? "";
    } else if (walletType === "albedo") {
        const res = await albedo.tx({ xdr: transactionXdr, submit: true });
        return res.signed_envelope_xdr;
    }
    throw new Error("Invalid wallet type");
}

export function isWalletConnected(): boolean {
    const data = localStorage.getItem("wallet_data");
    return !!data;
}
