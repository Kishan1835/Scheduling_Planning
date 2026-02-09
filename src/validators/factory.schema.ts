import { z } from 'zod';

export const createFactorySchema = z.object({
    body: z.object({
        factoryCode: z.string().min(3).max(20),
        factoryName: z.string().min(3).max(100),
        industryType: z.string().min(2).max(50),
        factoryLocation: z.string().min(3).max(200),
    }),
});

export const updateFactorySchema = z.object({
    body: z.object({
        factoryName: z.string().min(3).max(100).optional(),
        industryType: z.string().min(2).max(50).optional(),
        factoryLocation: z.string().min(3).max(200).optional(),
    }),
});

export const getFactoriesQuerySchema = z.object({
    query: z.object({
        page: z.string().optional().transform(val => parseInt(val || '1')),
        limit: z.string().optional().transform(val => Math.min(parseInt(val || '20'), 100)),
        industryType: z.string().optional(),
        factoryLocation: z.string().optional(),
        search: z.string().optional(),
    }),
});

export type CreateFactoryInput = z.infer<typeof createFactorySchema>['body'];
export type UpdateFactoryInput = z.infer<typeof updateFactorySchema>['body'];
export type GetFactoriesQuery = z.infer<typeof getFactoriesQuerySchema>['query'];