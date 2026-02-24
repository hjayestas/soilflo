import { Model, DataTypes } from 'sequelize';
import { sequelize } from "../database";

interface Sites {
  id: number;
  name: string;
  address: string;
  description: string;
}

type SiteCreationAttributes = Sites;

export class Site extends Model<Sites, SiteCreationAttributes> {
  declare id: number;
  declare name: string;
  declare address: string;
  declare description: string;

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
                type: new DataTypes.STRING(255),
                allowNull: false,
            },
            address: {
                type: new DataTypes.TEXT,
                allowNull: false,
            },
            description: {
                type: new DataTypes.TEXT,
                allowNull: false,
            },
        },
        {
            sequelize,
            tableName: 'sites',
        });
    
    return Site;
};

export async function createSites(sites: Sites[]) {
    const transaction= await sequelize.transaction();

    try {
        const createdSites = await Site.bulkCreate(sites, {
            ignoreDuplicates: true,
            transaction: transaction,
        });

        await transaction.commit();

        return createdSites;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
}