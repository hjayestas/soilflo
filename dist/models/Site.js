"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initSiteModel = exports.Site = void 0;
exports.createSites = createSites;
exports.fetchSites = fetchSites;
const sequelize_1 = require("sequelize");
const database_1 = require("../database");
class Site extends sequelize_1.Model {
}
exports.Site = Site;
const initSiteModel = () => {
    Site.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            primaryKey: true,
        },
        name: {
            type: new sequelize_1.DataTypes.STRING(255),
            allowNull: false,
        },
        address: {
            type: new sequelize_1.DataTypes.TEXT,
            allowNull: false,
        },
        description: {
            type: new sequelize_1.DataTypes.TEXT,
            allowNull: false,
        },
    }, {
        sequelize: database_1.sequelize,
        tableName: 'sites',
    });
    return Site;
};
exports.initSiteModel = initSiteModel;
async function createSites(sites) {
    const transaction = await database_1.sequelize.transaction();
    try {
        const createdSites = await Site.bulkCreate(sites, {
            ignoreDuplicates: true,
            transaction: transaction,
        });
        await transaction.commit();
        return createdSites;
    }
    catch (error) {
        await transaction.rollback();
        throw error;
    }
}
async function fetchSites() {
    try {
        const sites = await Site.findAll();
        return sites;
    }
    catch (error) {
        console.error('Error fetching sites:', error);
        throw error;
    }
}
//# sourceMappingURL=Site.js.map