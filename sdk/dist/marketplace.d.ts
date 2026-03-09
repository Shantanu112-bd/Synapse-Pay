export interface Service {
    id: string;
    name: string;
    description: string;
    pricePerCall: number;
    category: string;
    endpoint: string;
}
export declare class Marketplace {
    services: Service[];
    constructor();
    listServices(category?: string): Promise<Service[]>;
    getService(serviceId: string): Promise<Service | null>;
    registerService(details: Omit<Service, 'id'>): Promise<string>;
}
