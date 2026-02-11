import { prisma } from '../config/prisma';
import { CreateMachineTypeInput, UpdateMachineTypeInput } from '../validators/machineType.schema';

export class MachineTypeService {
    async create(factoryId: number, bayId: number, data: CreateMachineTypeInput) {
        // Verify bay belongs to factory
        const bay = await prisma.bay.findFirst({
            where: { bayId, factoryId },
        });

        if (!bay) {
            const error = new Error('Bay does not belong to the specified factory') as any;
            error.name = 'BusinessRuleError';
            error.details = { factoryId, bayId };
            throw error;
        }

        return await prisma.machineType.create({
            data: {
                ...data,
                factoryId,
                bayId,
            },
        });
    }

    async getAll(query: any) {
        const { factoryId, bayId, search } = query;

        const where: any = {};

        if (factoryId) {
            where.factoryId = parseInt(factoryId);
        }

        if (bayId) {
            where.bayId = parseInt(bayId);
        }

        if (search) {
            where.typeName = {
                contains: search,
                mode: 'insensitive'
            };
        }

        return await prisma.machineType.findMany({
            where,
            include: {
                factory: {
                    select: {
                        factoryId: true,
                        factoryName: true,
                        factoryCode: true,
                    }
                },
                bay: {
                    select: {
                        bayId: true,
                        bayName: true,
                    }
                },
                _count: {
                    select: { machines: true },
                },
            },
            orderBy: { machineTypeId: 'desc' },
        });
    }

    async getByFactory(factoryId: number) {
        return await prisma.machineType.findMany({
            where: { factoryId },
            include: {
                bay: {
                    select: {
                        bayId: true,
                        bayName: true,
                    }
                },
                _count: {
                    select: { machines: true },
                },
            },
            orderBy: { machineTypeId: 'desc' },
        });
    }

    async getById(machineTypeId: number) {
        const machineType = await prisma.machineType.findUnique({
            where: { machineTypeId },
            include: {
                factory: true,
                bay: true,
                machines: true,
            },
        });

        if (!machineType) {
            throw new Error('MachineType not found');
        }

        return machineType;
    }

    async update(machineTypeId: number, data: UpdateMachineTypeInput) {
        const updateData = Object.fromEntries(
            Object.entries(data).filter(([, v]) => v !== undefined),
        );
        return await prisma.machineType.update({
            where: { machineTypeId },
            data: updateData,
        });
    }

    async delete(machineTypeId: number) {
        // Check if any machines use this type
        const machineCount = await prisma.machine.count({
            where: { machineTypeId },
        });

        if (machineCount > 0) {
            const error = new Error('Cannot delete machine type that has machines assigned') as any;
            error.name = 'BusinessRuleError';
            error.details = { machineTypeId, machineCount };
            throw error;
        }

        await prisma.machineType.delete({
            where: { machineTypeId },
        });
    }
}