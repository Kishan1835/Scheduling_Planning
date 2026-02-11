import { z } from 'zod';

// Enum for units (matching your Prisma schema)
const UnitEnum = z.enum([
    'G', 'KG', 'ML', 'L', 'TSP', 'TBSP', 'CUP',
    'FL_OZ', 'OZ', 'LB', 'PINCH', 'PIECE'
]);

export const createInventorySchema = z.object({
    params: z.object({
        factoryId: z.string().transform(val => parseInt(val)),
    }),
    body: z.object({
        materialName: z.string().min(2).max(100),
        lotNumber: z.string().min(3).max(50),
        quantity: z.number().min(0),
        unit: UnitEnum,
        sapMaterialId: z.string().min(3).max(50),
    }),
});

export const updateInventorySchema = z.object({
    params: z.object({
        inventoryId: z.string().transform(val => parseInt(val)),
    }),
    body: z.object({
        materialName: z.string().min(2).max(100).optional(),
        lotNumber: z.string().min(3).max(50).optional(),
        quantity: z.number().min(0).optional(),
        unit: UnitEnum.optional(),
        sapMaterialId: z.string().min(3).max(50).optional(),
        lastSyncTime: z.string().datetime().optional(),
    }),
});

export const getInventoryQuerySchema = z.object({
    query: z.object({
        factoryId: z.string().optional().transform(val => val ? parseInt(val) : undefined),
        materialName: z.string().optional(),
        lowStock: z.string().optional().transform(val => val === 'true'),
        threshold: z.string().optional().transform(val => val ? parseFloat(val) : 10),
    }),
});

export type CreateInventoryInput = z.infer<typeof createInventorySchema>['body'];
export type UpdateInventoryInput = z.infer<typeof updateInventorySchema>['body'];
export type GetInventoryQuery = z.infer<typeof getInventoryQuerySchema>['query'];