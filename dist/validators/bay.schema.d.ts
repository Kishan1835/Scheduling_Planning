import { z } from 'zod';
export declare const createBaySchema: z.ZodObject<{
    params: z.ZodObject<{
        factoryId: z.ZodString;
    }, z.core.$strip>;
    body: z.ZodObject<{
        bayName: z.ZodString;
        maxMachineCapacity: z.ZodNumber;
        isActive: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const updateBaySchema: z.ZodObject<{
    params: z.ZodObject<{
        bayId: z.ZodString;
    }, z.core.$strip>;
    body: z.ZodObject<{
        bayName: z.ZodOptional<z.ZodString>;
        maxMachineCapacity: z.ZodOptional<z.ZodNumber>;
        isActive: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const getBaysQuerySchema: z.ZodObject<{
    query: z.ZodObject<{
        page: z.ZodPipe<z.ZodOptional<z.ZodString>, z.ZodTransform<number, string | undefined>>;
        limit: z.ZodPipe<z.ZodOptional<z.ZodString>, z.ZodTransform<number, string | undefined>>;
        factoryId: z.ZodPipe<z.ZodOptional<z.ZodString>, z.ZodTransform<number | undefined, string | undefined>>;
        isActive: z.ZodPipe<z.ZodOptional<z.ZodString>, z.ZodTransform<boolean | undefined, string | undefined>>;
    }, z.core.$strip>;
}, z.core.$strip>;
export type CreateBayInput = z.infer<typeof createBaySchema>['body'];
export type UpdateBayInput = z.infer<typeof updateBaySchema>['body'];
export type GetBaysQuery = z.infer<typeof getBaysQuerySchema>['query'];
//# sourceMappingURL=bay.schema.d.ts.map