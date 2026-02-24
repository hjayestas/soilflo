import { Model, DataTypes, Op } from 'sequelize';
import { sequelize } from "../database";
import { Site } from './Site';
import { Truck } from './Truck';

interface Tickets {
  id: number;
  name: string;
  license: string;
  material: string;
  ticketNumber: number;
}

type TicketCreationAttributes = Tickets;

class Ticket extends Model<Tickets, TicketCreationAttributes> {
  declare id: number;
  declare tickerNumber: number;
  declare name: string;
  declare license: string;
  declare material: string;

  declare createdAt: Date;
  declare updatedAt: Date;
}

export const initTicketModel = () => {
    Ticket.init({
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            name: {
                type: new DataTypes.STRING(128),
                allowNull: false,
            },
            license: {
                type: new DataTypes.STRING(128),
                allowNull: false,
            },
            material: {
                type: new DataTypes.STRING(128),
                allowNull: false,
            },
            ticketNumber: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        {
            sequelize,
            tableName: 'tickets',
        });

    return Ticket;
};

export async function createTickets(tickets: Tickets[]) {
    const transaction= await sequelize.transaction();

    try {
        const truckLicenses = tickets.map(t => t.license);
        const siteNames = tickets.map(t => t.name);

        const trucks = await Truck.findAll({
            where: { license: truckLicenses },
            transaction,
        });

        const sites = await Site.findAll({
            where: { name: siteNames },
            transaction,
        });

        const ticketsToCreate = [];

        for (const t of tickets) {
            const truck = trucks.find(tr => tr.license === t.license);
            const site = sites.find(s => s.name === t.name);

            if (!truck) throw new Error(`Truck not found: ${t.license}`);
            if (!site) throw new Error(`Site not found: ${t.name}`);

            const currentMax = await Ticket.max('ticketNumber', {
                where: { name: site.name },
                transaction,
            });

            const nextTicketNumber = (Number(currentMax) || 0) + 1;

            ticketsToCreate.push({
                ...t,
                ticketNumber: nextTicketNumber,
            });
        }

        const createdTickets = await Ticket.bulkCreate(ticketsToCreate, {
            validate: true,
            transaction,
        });

        await transaction.commit();

        return createdTickets;
    } catch (error) {
        await transaction.rollback();
        console.error('Bulk insert failed:', error);
        throw error;
    }
}


export async function fetchTickets(siteName: string, fromDate: Date, toDate: Date, page: number = 1, pageSize: number = 50) {
    try {
        const offset = (page - 1) * pageSize;
        const { rows, count } =  await Ticket.findAndCountAll({
            where: {
                ...(siteName && { name: siteName }),

                ...(fromDate && toDate && {
                    createdAt: {
                        [Op.between]: [fromDate, toDate],
                    },
                }),
            },
            limit: pageSize,
            offset: offset,
            order: [["createdAt", "DESC"]],
        });

        return {
            data: rows,
            pagination: {
                total: count,
                page,
                pageSize,
                totalPages: Math.ceil(count / pageSize),
            },
        };
    } catch (error) {
        console.error("Error fetching tickets:", error);
        throw error;
    }
}

export async function fetchAllTickets() {
    try {
        const tickets = await Ticket.findAll();
        return tickets;
    } catch (error) {
        console.error('Error fetching tickets:', error);
        throw error;
    }
}