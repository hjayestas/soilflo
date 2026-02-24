import { Model } from 'sequelize';
interface Tickets {
    id: number;
    name: string;
    license: string;
    material: string;
    ticketNumber: number;
}
type TicketCreationAttributes = Tickets;
declare class Ticket extends Model<Tickets, TicketCreationAttributes> {
    id: number;
    tickerNumber: number;
    name: string;
    license: string;
    material: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare const initTicketModel: () => typeof Ticket;
export declare function createTickets(tickets: Tickets[]): Promise<Ticket[]>;
export declare function fetchTickets(siteName: string, fromDate: Date, toDate: Date, page?: number, pageSize?: number): Promise<{
    data: Ticket[];
    pagination: {
        total: number;
        page: number;
        pageSize: number;
        totalPages: number;
    };
}>;
export {};
//# sourceMappingURL=Ticket.d.ts.map