import { z } from 'zod';

export const createMachineTypeSchema = z.object({
    params: z.object({
        factoryId: z.string().transform(val => parseInt(val)),
        bayId: z.string().transform(val => parseInt(val)),
    }),
    body: z.object({
        typeName: z.string().min(2).max(100),
        capabilities: z.record(z.string(), z.any()), // JSON object
        constraints: z.record(z.string(), z.any()),  // JSON object
    }),
});

export const updateMachineTypeSchema = z.object({
    params: z.object({
        machineTypeId: z.string().transform(val => parseInt(val)),
    }),
    body: z.object({
        typeName: z.string().min(2).max(100).optional(),
        capabilities: z.record(z.string(), z.any()).optional(),
        constraints: z.record(z.string(), z.any()).optional(),
    }),
});

export type CreateMachineTypeInput = z.infer<typeof createMachineTypeSchema>['body'];
export type UpdateMachineTypeInput = z.infer<typeof updateMachineTypeSchema>['body'];