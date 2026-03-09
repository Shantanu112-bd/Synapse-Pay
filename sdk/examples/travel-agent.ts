import { Agent, Payments, Marketplace } from '../src';

async function main() {
    console.log('--- SynapsPay AI Agent Example: Travel Boss ---\n');

    // 1. Discover Services
    const marketplace = new Marketplace();
    console.log('-- Initializing Marketplace --');

    const weatherSrv = await marketplace.getService("srv_weather");
    const flightsSrv = await marketplace.getService("srv_flights");
    const hotelsSrv = await marketplace.getService("srv_hotels");

    // 2. Create the AI Agent
    console.log('\n-- Creating Agent --');
    const travelAgent = await Agent.createAgent("Travel Boss", {
        type: "Travel",
        dailyBudget: 5.0,
        totalBudget: 20.0,
        categories: ["Weather", "Flights", "Hotels"]
    });

    // 3. Fund Agent Wallet
    console.log('\n-- Funding Agent --');
    await travelAgent.fund(10.0);
    console.log(`Current Balance: ${await travelAgent.getBalance()} USDC`);

    // 4. Execute Payments securely
    console.log('\n-- Executing Payments --');
    const payments = new Payments(travelAgent);

    if (weatherSrv) {
        await payments.pay(weatherSrv.id, weatherSrv.pricePerCall);
    }

    if (flightsSrv) {
        // Locking an escrow payment for flights since it takes longer to process
        await payments.payWithEscrow(flightsSrv.id, flightsSrv.pricePerCall, 3600);
    }

    if (hotelsSrv) {
        await payments.pay(hotelsSrv.id, hotelsSrv.pricePerCall);
    }

    // 5. Audit Results
    console.log('\n-- Audit & Metrics --');
    const remaining = await travelAgent.getBalance();
    console.log(`Final Rest Balance: ${remaining} USDC`);

    const totalSpent = await payments.getSpendingToday();
    console.log(`Total USDC Spent Today: ${totalSpent} USDC`);

    const history = await payments.getHistory();
    console.log('Transaction History Array: ', history);

    console.log('\n-- Run Complete --');
}

main().catch(console.error);
