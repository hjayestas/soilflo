import { Model, DataTypes, Op } from 'sequelize';
import { sequelize } from "./database";

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


class Site extends Model<Sites, SiteCreationAttributes> {
  declare id: number;
  declare name: string;
  declare address: string;
  declare description: string;

  declare createdAt: Date;
  declare updatedAt: Date;
}

class Truck extends Model<Trucks, TruckCreationAttributes> {
  declare id: number;
  declare license: string;
  declare siteId: number;

  declare createdAt: Date;
  declare updatedAt: Date;
}

class Ticket extends Model<Tickets, TicketCreationAttributes> {
  declare id: number;
  declare name: string;
  declare license: string;
  declare material: string;

  declare createdAt: Date;
  declare updatedAt: Date;
}

export const initSiteModel = () => {
    Site.init({
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
            },
            name: {
                type: new DataTypes.STRING(128),
                allowNull: false,
            },
            address: {
                type: new DataTypes.STRING(128),
                allowNull: false,
            },
            description: {
                type: new DataTypes.STRING(128),
                allowNull: false,
            },
        },
        {
            sequelize,
            tableName: 'sites',
        });
    
    return Site;
};

export const initTruckModel = () => {
    Truck.init({
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
            },
            license: {
                type: new DataTypes.STRING(128),
                allowNull: false,
            },
            siteId: {
                type: new DataTypes.STRING(128),
                allowNull: false,
            },
        },
        {
            sequelize,
            tableName: 'trucks',
        });

    return Truck;
};

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
        const createdTickets = await Ticket.bulkCreate(tickets, {
            validate: true,
            transaction: transaction,
        });

        await transaction.commit();

        return createdTickets;
    } catch (error) {
        await transaction.rollback();
        console.error("Bulk insert failed:", error);
        throw error;
    }
}


export async function fetchTickets(siteName: string, fromDate: Date, toDate: Date) {
    try {
        return await Ticket.findAll({
            where: {
                ...(siteName && { site: siteName }),

                ...(fromDate && toDate && {
                    createdAt: {
                        [Op.between]: [fromDate, toDate],
                    },
                }),
            },
        });
    } catch (error) {
        console.error("Error fetching tickets:", error);
        throw error;
    }
}