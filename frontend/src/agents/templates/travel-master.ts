/* eslint-disable @typescript-eslint/no-explicit-any */
export interface AgentTemplate {
    id: string;
    name: string;
    category: string;
    description: string;
    exampleInput: string;
    exampleOutput: string;
    estimatedCost: string;
    usesApis: string[];
    deployCount: number;
    rating: number;
    systemPrompt: string;
    inputSchema: any;
    outputSchema: any;
    steps: { name: string; service: string; cost: number; duration: number }[];
}

export const TravelMaster: AgentTemplate = {
    id: "travel-master",
    name: "TravelMaster Agent",
    category: "Travel",
    description: "Autonomously plans trips by paying for weather, flights, hotels, and maps APIs.",
    exampleInput: "{ destination: 'Tokyo', dates: 'Oct 1-10', budget: '$2000', people: 2 }",
    exampleOutput: "{ itinerary: [...], flights: [...], hotels: [...], weather: {...}, totalCost: '$0.0016' }",
    estimatedCost: "$0.0016 USDC",
    usesApis: ["WeatherAPI", "FlightSearch", "HotelFinder", "GoogleMaps"],
    deployCount: 1243,
    rating: 4.9,
    systemPrompt: "You are a travel planning AI. When given a destination and dates, you call WeatherAPI, FlightSearch, HotelFinder, and GoogleMaps in sequence. You pay for each API call automatically using your SynapsPay wallet before calling it.",
    inputSchema: { destination: "string", dates: "string", budget: "string", people: "number" },
    outputSchema: { itinerary: "array", flights: "array", hotels: "array", weather: "object", totalCost: "number" },
    steps: [
        { name: "Fetching weather data", service: "WeatherAPI", cost: 0.0002, duration: 800 },
        { name: "Finding best flights", service: "FlightSearch", cost: 0.0005, duration: 1200 },
        { name: "Locating top hotels", service: "HotelFinder", cost: 0.0008, duration: 1500 },
        { name: "Mapping itineraries", service: "GoogleMaps", cost: 0.0001, duration: 900 }
    ]
};
