import prisma from '../config/prisma';
import { CreateInventoryInput, UpdateInventoryInput, GetInventoryQuery } from '../validators/inventory.schema';

export class InventoryService {
    async create(factoryId: number, data: CreateInventoryInput) {
        // Verify factory exists
        const factory = await prisma.factory.findUnique({
            where: { factoryId },
        });

        if (!factory) {
            throw new Error('Factory not found');
        }

        return await prisma.inventoryItem.create({
            data: {
                ...data,
                factoryId,
                lastSyncTime: new Date(),
            },
            include: {
                factory: {
                    select: {
                        factoryId: true,
                        factoryName: true,
                        factoryCode: true,
                    }
                }
            }
        });
    }

    async getAll(query: any) {
        // Manual parsing to ensure correct types
        const factoryId = query.factoryId ? parseInt(query.factoryId) : undefined;
        const materialName = query.materialName;
        const lowStock = query.lowStock === 'true' || query.lowStock === true;
        const threshold = query.threshold ? parseFloat(query.threshold) : 10;

        const where: any = {};

        if (factoryId) {
            where.factoryId = factoryId;  // Now it's a number
        }

        if (materialName) {
            where.materialName = {
                contains: materialName,
                mode: 'insensitive'
            };
        }

        if (lowStock) {
            where.quantity = {
                lt: threshold
            };
        }

        return await prisma.inventoryItem.findMany({
            where,
            include: {
                factory: {
                    select: {
                        factoryId: true,
                        factoryName: true,
                        factoryCode: true,
                    }
                }
            },
            orderBy: { inventoryId: 'desc' },
        });
    }

    async getByFactory(factoryId: number) {
        return await prisma.inventoryItem.findMany({
            where: { factoryId },
            orderBy: { inventoryId: 'desc' },
        });
    }

    async getById(inventoryId: number) {
        const inventory = await prisma.inventoryItem.findUnique({
            where: { inventoryId },
            include: {
                factory: true,
            },
        });

        if (!inventory) {
            throw new Error('Inventory item not found');
        }

        return inventory;
    }

    async update(inventoryId: number, data: UpdateInventoryInput) {
        const payload = { ...data };
        if (payload.quantity !== undefined && !payload.lastSyncTime) {
            payload.lastSyncTime = new Date().toISOString();
        }
        const updateData = Object.fromEntries(
            Object.entries(payload).filter(([, v]) => v !== undefined),
        );

        return await prisma.inventoryItem.update({
            where: { inventoryId },
            data: updateData,
            include: {
                factory: {
                    select: {
                        factoryId: true,
                        factoryName: true,
                        factoryCode: true,
                    }
                }
            }
        });
    }

    async delete(inventoryId: number) {
        await prisma.inventoryItem.delete({
            where: { inventoryId },
        });
    }
}