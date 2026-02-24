import { Model } from 'sequelize';
interface Sites {
    id: number;
    name: string;
    address: string;
    description: string;
}
interface Trucks {
    id: number;
    license: string;
    siteId: number;
}
interface Tickets {
    id: number;
    name: string;
    license: string;
    material: string;
}
type SiteCreationAttributes = Sites;
type TruckCreationAttributes = Trucks;
type TicketCreationAttributes = Tickets;
declare class Site extends Model<Sites, SiteCreationAttributes> {
    id: number;
    name: string;
    address: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
}
declare class Truck extends Model<Trucks, TruckCreationAttributes> {
    id: number;
    license: string;
    siteId: number;
    createdAt: Date;
    updatedAt: Date;
}
declare class Ticket extends Model<Tickets, TicketCreationAttributes> {
    id: number;
    name: string;
    license: string;
    material: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare const initSiteModel: () => typeof Site;
export declare const initTruckModel: () => typeof Truck;
export declare const initTicketModel: () => typeof Ticket;
export declare function createTickets(tickets: Tickets[]): Promise<Ticket[]>;
export declare function fetchTickets(siteName: string, fromDate: Date, toDate: Date): Promise<Ticket[]>;
export {};
//# sourceMappingURL=backend.d.ts.map