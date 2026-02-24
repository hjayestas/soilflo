"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initTruckModel = exports.Truck = void 0;
exports.createTrucks = createTrucks;
exports.fetchTrucks = fetchTrucks;
const sequelize_1 = require("sequelize");
const database_1 = require("../database");
class Truck extends sequelize_1.Model {
}
exports.Truck = Truck;
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
            type: new sequelize_1.DataTypes.TEXT,
            allowNull: false,
        },
    }, {
        sequelize: database_1.sequelize,
        tableName: 'trucks',
    });
    return Truck;
};
exports.initTruckModel = initTruckModel;
async function createTrucks(trucks) {
    const transaction = await database_1.sequelize.transaction();
    try {
        const createdTrucks = await Truck.bulkCreate(trucks, {
            ignoreDuplicates: true,
            transaction: transaction,
        });
        await transaction.commit();
        return createdTrucks;
    }
    catch (error) {
        await transaction.rollback();
        throw error;
    }
}
async function fetchTrucks() {
    try {
        const trucks = await Truck.findAll();
        return trucks;
    }
    catch (error) {
        console.error('Error fetching trucks:', error);
        throw error;
    }
}
//# sourceMappingURL=Truck.js.map