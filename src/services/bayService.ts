import { Prisma } from '@prisma/client';
import { prisma } from '../config/prisma';
import type {
  CreateBayInput,
  UpdateBayInput,
  GetBaysQuery,
} from '../validators/bay.schema';

export class BayService {
  async getAll(query: GetBaysQuery) {
    const { page = 1, limit = 20, factoryId, isActive } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.BayWhereInput = {
      ...(factoryId !== undefined && { factoryId }),
      ...(isActive !== undefined && { isActive }),
    };

    const [bays, total] = await Promise.all([
      prisma.bay.findMany({
        where,
        skip,
        take: limit,
      }),
      prisma.bay.count({ where }),
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

  async getByFactory(factoryId: number) {
    const bays = await prisma.bay.findMany({
      where: { factoryId },
      include: { _count: { select: { machines: true } } },
    });

    return (bays as any[]).map(({ _count, ...bay }) => ({
      ...bay,
      _machineCount: _count.machines,
    }));
  }

  async getById(bayId: number) {
    const bay = await prisma.bay.findUnique({
      where: { bayId },
      include: { machines: true },
    });

    if (!bay) {
      throw new Error('Bay not found');
    }

    return bay;
  }

  async create(factoryId: number, data: CreateBayInput) {
    const factory = await prisma.factory.findUnique({
      where: { factoryId },
    });
    if (!factory) {
      const error = new Error('Factory not found') as Error & { code?: string };
      error.code = 'FACTORY_NOT_FOUND';
      throw error;
    }

    return await prisma.bay.create({
      data: {
        ...data,
        factoryId,
      },
    });
  }

  async update(bayId: number, data: UpdateBayInput) {
    // If reducing capacity, check current machine count
    if (data.maxMachineCapacity !== undefined) {
      const bay = await prisma.bay.findUnique({
        where: { bayId },
        include: { _count: { select: { machines: true } } },
      });

      if (bay && data.maxMachineCapacity < bay._count.machines) {
        const error = new Error(
          'Cannot reduce capacity below current machine count',
        ) as any;
        error.name = 'BusinessRuleError';
        error.details = {
          currentCapacity: bay.maxMachineCapacity,
          requestedCapacity: data.maxMachineCapacity,
          currentMachineCount: bay._count.machines,
        };
        throw error;
      }
    }

    const updateData = Object.fromEntries(
      Object.entries(data).filter(([, v]) => v !== undefined),
    ) as Prisma.BayUpdateInput;

    return await prisma.bay.update({ where: { bayId }, data: updateData });
  }

  async delete(bayId: number) {
    await prisma.bay.delete({ where: { bayId } });
  }
}