import { Prisma } from '@prisma/client';
import type { CreateFactoryInput, UpdateFactoryInput, GetFactoriesQuery } from '../validators/factory.schema';
export declare class FactoryService {
    getAll(query: GetFactoriesQuery): Promise<{
        factories: {
            factoryCode: string;
            factoryName: string;
            industryType: string;
            factoryLocation: string;
            factoryId: number;
            createdAt: Date;
        }[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getById(factoryId: number, include?: string[]): Promise<{
        sapSystem: {
            factoryId: number;
            sapInstanceName: string;
            integrationType: string;
            sapSystemId: number;
        } | null;
        bays: {
            factoryId: number;
            bayName: string;
            maxMachineCapacity: number;
            isActive: boolean;
            bayId: number;
        }[];
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
        machineTypes: {
            factoryId: number;
            bayId: number;
            machineTypeId: number;
            typeName: string;
            capabilities: Prisma.JsonValue;
            constraints: Prisma.JsonValue;
        }[];
        inventory: {
            factoryId: number;
            materialName: string;
            lotNumber: string;
            quantity: number;
            unit: string;
            sapMaterialId: string;
            lastSyncTime: Date;
            inventoryId: number;
        }[];
        _count: {
            sapSystem: number;
            bays: number;
            machines: number;
            machineTypes: number;
            inventory: number;
        };
    } & {
        factoryCode: string;
        factoryName: string;
        industryType: string;
        factoryLocation: string;
        factoryId: number;
        createdAt: Date;
    }>;
    create(data: CreateFactoryInput): Promise<{
        factoryCode: string;
        factoryName: string;
        industryType: string;
        factoryLocation: string;
        factoryId: number;
        createdAt: Date;
    }>;
    update(factoryId: number, data: UpdateFactoryInput): Promise<{
        factoryCode: string;
        factoryName: string;
        industryType: string;
        factoryLocation: string;
        factoryId: number;
        createdAt: Date;
    }>;
    delete(factoryId: number): Promise<void>;
}
//# sourceMappingURL=factoryService.d.ts.map