"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BayService = void 0;
const prisma_1 = require("../config/prisma");
class BayService {
    async getAll(query) {
        const { page = 1, limit = 20, factoryId, isActive } = query;
        const skip = (page - 1) * limit;
        const where = {
            ...(factoryId !== undefined && { factoryId }),
            ...(isActive !== undefined && { isActive }),
        };
        const [bays, total] = await Promise.all([
            prisma_1.prisma.bay.findMany({
                where,
                skip,
                take: limit,
            }),
            prisma_1.prisma.bay.count({ where }),
        ]);
        return {
            bays,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async getByFactory(factoryId) {
        const bays = await prisma_1.prisma.bay.findMany({
            where: { factoryId },
            include: { _count: { select: { machines: true } } },
        });
        return bays.map(({ _count, ...bay }) => ({
            ...bay,
            _machineCount: _count.machines,
        }));
    }
    async getById(bayId) {
        const bay = await prisma_1.prisma.bay.findUnique({
            where: { bayId },
            include: { machines: true },
        });
        if (!bay) {
            throw new Error('Bay not found');
        }
        return bay;
    }
    async create(factoryId, data) {
        return await prisma_1.prisma.bay.create({
            data: {
                ...data,
                factoryId,
            },
        });
    }
    async update(bayId, data) {
        // If reducing capacity, check current machine count
        if (data.maxMachineCapacity !== undefined) {
            const bay = await prisma_1.prisma.bay.findUnique({
                where: { bayId },
                include: { _count: { select: { machines: true } } },
            });
            if (bay && data.maxMachineCapacity < bay._count.machines) {
                const error = new Error('Cannot reduce capacity below current machine count');
                error.name = 'BusinessRuleError';
                error.details = {
                    currentCapacity: bay.maxMachineCapacity,
                    requestedCapacity: data.maxMachineCapacity,
                    currentMachineCount: bay._count.machines,
                };
                throw error;
            }
        }
        const updateData = Object.fromEntries(Object.entries(data).filter(([, v]) => v !== undefined));
        return await prisma_1.prisma.bay.update({ where: { bayId }, data: updateData });
    }
    async delete(bayId) {
        await prisma_1.prisma.bay.delete({ where: { bayId } });
    }
}
exports.BayService = BayService;
//# sourceMappingURL=bayService.js.map