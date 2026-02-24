"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initTicketModel = void 0;
exports.createTickets = createTickets;
exports.fetchTickets = fetchTickets;
const sequelize_1 = require("sequelize");
const database_1 = require("../database");
const Site_1 = require("./Site");
const Truck_1 = require("./Truck");
class Ticket extends sequelize_1.Model {
}
const initTicketModel = () => {
    Ticket.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: new sequelize_1.DataTypes.STRING(128),
            allowNull: false,
        },
        license: {
            type: new sequelize_1.DataTypes.STRING(128),
            allowNull: false,
        },
        material: {
            type: new sequelize_1.DataTypes.STRING(128),
            allowNull: false,
        },
        ticketNumber: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
        },
    }, {
        sequelize: database_1.sequelize,
        tableName: 'tickets',
    });
    return Ticket;
};
exports.initTicketModel = initTicketModel;
async function createTickets(tickets) {
    const transaction = await database_1.sequelize.transaction();
    try {
        const truckLicenses = tickets.map(t => t.license);
        const siteNames = tickets.map(t => t.name);
        const trucks = await Truck_1.Truck.findAll({
            where: { license: truckLicenses },
            transaction,
        });
        const sites = await Site_1.Site.findAll({
            where: { name: siteNames },
            transaction,
        });
        const ticketsToCreate = [];
        for (const t of tickets) {
            const truck = trucks.find(tr => tr.license === t.license);
            const site = sites.find(s => s.name === t.name);
            if (!truck)
                throw new Error(`Truck not found: ${t.license}`);
            if (!site)
                throw new Error(`Site not found: ${t.name}`);
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
    }
    catch (error) {
        await transaction.rollback();
        console.error('Bulk insert failed:', error);
        throw error;
    }
}
async function fetchTickets(siteName, fromDate, toDate, page = 1, pageSize = 50) {
    try {
        const offset = (page - 1) * pageSize;
        const { rows, count } = await Ticket.findAndCountAll({
            where: {
                ...(siteName && { name: siteName }),
                ...(fromDate && toDate && {
                    createdAt: {
                        [sequelize_1.Op.between]: [fromDate, toDate],
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
    }
    catch (error) {
        console.error("Error fetching tickets:", error);
        throw error;
    }
}
//# sourceMappingURL=Ticket.js.map