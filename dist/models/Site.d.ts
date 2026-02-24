import { Model } from 'sequelize';
interface Sites {
    id: number;
    name: string;
    address: string;
    description: string;
}
type SiteCreationAttributes = Sites;
export declare class Site extends Model<Sites, SiteCreationAttributes> {
    id: number;
    name: string;
    address: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare const initSiteModel: () => typeof Site;
export declare function createSites(sites: Sites[]): Promise<Site[]>;
export declare function fetchSites(): Promise<Site[]>;
export {};
//# sourceMappingURL=Site.d.ts.map