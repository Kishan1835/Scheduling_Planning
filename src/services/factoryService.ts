import { Prisma } from '@prisma/client';
import { prisma } from '../config/prisma';
import type { CreateFactoryInput, UpdateFactoryInput, GetFactoriesQuery } from '../validators/factory.schema';

export class FactoryService {
    async getAll(query: GetFactoriesQuery) {
        const { page = 1, limit = 20, industryType, factoryLocation, search } = query;
        const skip = (page - 1) * limit;

        const where: Prisma.FactoryWhereInput = {
            ...(industryType && { industryType }),
            ...(factoryLocation && { factoryLocation: { contains: factoryLocation, mode: Prisma.QueryMode.insensitive } }),
            ...(search && {
                OR: [
                    { factoryName: { contains: search, mode: Prisma.QueryMode.insensitive } },
                    { factoryCode: { contains: search, mode: Prisma.QueryMode.insensitive } },
                ],
            }),
        };

        const [factories, total] = await Promise.all([
            prisma.factory.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            prisma.factory.count({ where }),
        ]);

        return {
            factories,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async getById(factoryId: number, include?: string[]) {
        const includeOptions: Prisma.FactoryInclude = {
            bays: include?.includes('bays') ?? false,
            machines: include?.includes('machines') ?? false,
            machineTypes: include?.includes('machineTypes') ?? false,
            inventory: include?.includes('inventory') ?? false,
        };

        const factory = await prisma.factory.findUnique({
            where: { factoryId },
            include: includeOptions,
        });

        if (!factory) {
            throw new Error('Factory not found');
        }

        return factory;
    }

    async create(data: CreateFactoryInput) {
        return await prisma.factory.create({ data });
    }

    async update(factoryId: number, data: UpdateFactoryInput) {
        const updateData = Object.fromEntries(
            Object.entries(data).filter(([, v]) => v !== undefined)
        ) as Prisma.FactoryUpdateInput;

        return await prisma.factory.update({
            where: { factoryId },
            data: updateData,
        });
    }

    async delete(factoryId: number) {
        await prisma.factory.delete({ where: { factoryId } });
    }
}