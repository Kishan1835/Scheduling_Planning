"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FactoryService = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = require("../config/prisma");
class FactoryService {
    async getAll(query) {
        const { page = 1, limit = 20, industryType, factoryLocation, search } = query;
        const skip = (page - 1) * limit;
        const where = {
            ...(industryType && { industryType }),
            ...(factoryLocation && { factoryLocation: { contains: factoryLocation, mode: client_1.Prisma.QueryMode.insensitive } }),
            ...(search && {
                OR: [
                    { factoryName: { contains: search, mode: client_1.Prisma.QueryMode.insensitive } },
                    { factoryCode: { contains: search, mode: client_1.Prisma.QueryMode.insensitive } },
                ],
            }),
        };
        const [factories, total] = await Promise.all([
            prisma_1.prisma.factory.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            prisma_1.prisma.factory.count({ where }),
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
    async getById(factoryId, include) {
        const includeOptions = {
            bays: include?.includes('bays') ?? false,
            machines: include?.includes('machines') ?? false,
            machineTypes: include?.includes('machineTypes') ?? false,
            inventory: include?.includes('inventory') ?? false,
        };
        const factory = await prisma_1.prisma.factory.findUnique({
            where: { factoryId },
            include: includeOptions,
        });
        if (!factory) {
            throw new Error('Factory not found');
        }
        return factory;
    }
    async create(data) {
        return await prisma_1.prisma.factory.create({ data });
    }
    async update(factoryId, data) {
        const updateData = Object.fromEntries(Object.entries(data).filter(([, v]) => v !== undefined));
        return await prisma_1.prisma.factory.update({
            where: { factoryId },
            data: updateData,
        });
    }
    async delete(factoryId) {
        await prisma_1.prisma.factory.delete({ where: { factoryId } });
    }
}
exports.FactoryService = FactoryService;
//# sourceMappingURL=factoryService.js.map