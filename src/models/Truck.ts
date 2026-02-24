import { Model, DataTypes } from 'sequelize';
import { sequelize } from "../database";

interface Trucks {
  id: number;
  license: string;
  siteId: number;
}

type TruckCreationAttributes = Trucks;

export class Truck extends Model<Trucks, TruckCreationAttributes> {
  declare id: number;
  declare license: string;
  declare siteId: number;

  declare createdAt: Date;
  declare updatedAt: Date;
}

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
                type: new DataTypes.TEXT,
                allowNull: false,
            },
        },
        {
            sequelize,
            tableName: 'trucks',
        });

    return Truck;
};

export async function createTrucks(trucks: Trucks[]) {
    const transaction= await sequelize.transaction();

    try {
        const createdTrucks = await Truck.bulkCreate(trucks, {
            ignoreDuplicates: true,
            transaction: transaction,
        });

        await transaction.commit();

        return createdTrucks;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
}