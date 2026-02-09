import type { CreateBayInput, UpdateBayInput, GetBaysQuery } from '../validators/bay.schema';
export declare class BayService {
    getAll(query: GetBaysQuery): Promise<{
        bays: {
            factoryId: number;
            bayName: string;
            maxMachineCapacity: number;
            isActive: boolean;
            bayId: number;
        }[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getByFactory(factoryId: number): Promise<any[]>;
    getById(bayId: number): Promise<{
        machines: {
            factoryId: number;
            bayId: number;
            modelNumber: string;
            installationDate: Date;
            healthState: string;
            usageHours: number;
            isAvailable: boolean;
            machineId: number;
            machineTypeId: number;
        }[];
    } & {
        factoryId: number;
        bayName: string;
        maxMachineCapacity: number;
        isActive: boolean;
        bayId: number;
    }>;
    create(factoryId: number, data: CreateBayInput): Promise<{
        factoryId: number;
        bayName: string;
        maxMachineCapacity: number;
        isActive: boolean;
        bayId: number;
    }>;
    update(bayId: number, data: UpdateBayInput): Promise<{
        factoryId: number;
        bayName: string;
        maxMachineCapacity: number;
        isActive: boolean;
        bayId: number;
    }>;
    delete(bayId: number): Promise<void>;
}
//# sourceMappingURL=bayService.d.ts.map