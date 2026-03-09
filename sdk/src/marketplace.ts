export interface Service {
    id: string;
    name: string;
    description: string;
    pricePerCall: number;
    category: string;
    endpoint: string;
}

const MOCK_SERVICES: Service[] = [
    { id: "srv_weather", name: "WeatherAPI Pro", description: "Real-time weather data", pricePerCall: 0.0002, category: "Weather", endpoint: "api.weather.com" },
    { id: "srv_flights", name: "FlightSearch AI", description: "Live flight prices", pricePerCall: 0.0005, category: "Flights", endpoint: "api.flights.com" },
    { id: "srv_hotels", name: "HotelFinder", description: "Global hotel data", pricePerCall: 0.0008, category: "Hotels", endpoint: "api.hotels.com" }
];

export class Marketplace {
    services: Service[];

    constructor() {
        this.services = [...MOCK_SERVICES];
    }

    async listServices(category?: string): Promise<Service[]> {
        console.log(`Listing active services on network${category ? ` in category ${category}` : ''}...`);
        if (category) {
            return this.services.filter(s => s.category === category);
        }
        return this.services;
    }

    async getService(serviceId: string): Promise<Service | null> {
        console.log(`Fetching details for service ${serviceId}...`);
        const service = this.services.find(s => s.id === serviceId);
        return service || null;
    }

    async registerService(details: Omit<Service, 'id'>): Promise<string> {
        console.log(`Registering new service ${details.name} on Stellar ledger...`);
        const id = `srv_${Date.now()}`;
        this.services.push({ id, ...details });
        return id;
    }
}
