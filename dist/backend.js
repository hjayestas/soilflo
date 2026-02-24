"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initTicketModel = exports.initTruckModel = exports.initSiteModel = void 0;
exports.createTickets = createTickets;
exports.fetchTickets = fetchTickets;
const sequelize_1 = require("sequelize");
const database_1 = require("./database");
class Site extends sequelize_1.Model {
}
class Truck extends sequelize_1.Model {
}
class Ticket extends sequelize_1.Model {
}
const initSiteModel = () => {
    Site.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            primaryKey: true,
        },
        name: {
            type: new sequelize_1.DataTypes.STRING(128),
            allowNull: false,
        },
        address: {
            type: new sequelize_1.DataTypes.STRING(128),
            allowNull: false,
        },
        description: {
            type: new sequelize_1.DataTypes.STRING(128),
            allowNull: false,
        },
    }, {
        sequelize: database_1.sequelize,
        tableName: 'sites',
    });
    return Site;
};
exports.initSiteModel = initSiteModel;
const initTruckModel = () => {
    Truck.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            primaryKey: true,
        },
        license: {
            type: new sequelize_1.DataTypes.STRING(128),
            allowNull: false,
        },
        siteId: {
            type: new sequelize_1.DataTypes.STRING(128),
            allowNull: false,
        },
    }, {
        sequelize: database_1.sequelize,
        tableName: 'trucks',
    });
    return Truck;
};
exports.initTruckModel = initTruckModel;
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
        const createdTickets = await Ticket.bulkCreate(tickets, {
            validate: true,
            transaction: transaction,
        });
        await transaction.commit();
        return createdTickets;
    }
    catch (error) {
        await transaction.rollback();
        console.error("Bulk insert failed:", error);
        throw error;
    }
}
async function fetchTickets(siteName, fromDate, toDate) {
    try {
        return await Ticket.findAll({
            where: {
                ...(siteName && { site: siteName }),
                ...(fromDate && toDate && {
                    createdAt: {
                        [sequelize_1.Op.between]: [fromDate, toDate],
                    },
                }),
            },
        });
    }
    catch (error) {
        console.error("Error fetching tickets:", error);
        throw error;
    }
}
//# sourceMappingURL=backend.js.map