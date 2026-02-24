import { Model } from 'sequelize';
interface Trucks {
    id: number;
    license: string;
    siteId: number;
}
type TruckCreationAttributes = Trucks;
export declare class Truck extends Model<Trucks, TruckCreationAttributes> {
    id: number;
    license: string;
    siteId: number;
    createdAt: Date;
    updatedAt: Date;
}
export declare const initTruckModel: () => typeof Truck;
export declare function createTrucks(trucks: Trucks[]): Promise<Truck[]>;
export declare function fetchTrucks(): Promise<Truck[]>;
export {};
//# sourceMappingURL=Truck.d.ts.map