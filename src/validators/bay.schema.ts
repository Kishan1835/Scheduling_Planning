import { z } from 'zod';

export const createBaySchema = z.object({
  params: z.object({
    factoryId: z
      .string()
      .refine((val) => /^\d+$/.test(val), 'factoryId must be a positive integer')
      .transform((val) => parseInt(val, 10)),
  }),
  body: z.object({
    bayName: z.string().min(2).max(50),
    maxMachineCapacity: z.number().int().min(1).max(1000),
    isActive: z.boolean().optional().default(true),
  }),
});

export const updateBaySchema = z.object({
  params: z.object({
    bayId: z.string(),
  }),
  body: z.object({
    bayName: z.string().min(2).max(50).optional(),
    maxMachineCapacity: z.number().int().min(1).max(1000).optional(),
    isActive: z.boolean().optional(),
  }),
});

export const getBaysQuerySchema = z.object({
  query: z.object({
    page: z
      .string()
      .optional()
      .transform((val) => parseInt(val || '1', 10)),
    limit: z
      .string()
      .optional()
      .transform((val) => Math.min(parseInt(val || '20', 10), 100)),
    factoryId: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val, 10) : undefined)),
    isActive: z
      .string()
      .optional()
      .transform((val) =>
        val === undefined ? undefined : val.toLowerCase() === 'true',
      ),
  }),
});

export type CreateBayInput = z.infer<typeof createBaySchema>['body'];
export type UpdateBayInput = z.infer<typeof updateBaySchema>['body'];
export type GetBaysQuery = z.infer<typeof getBaysQuerySchema>['query'];

