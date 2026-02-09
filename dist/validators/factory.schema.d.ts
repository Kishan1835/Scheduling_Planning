import { z } from 'zod';
export declare const createFactorySchema: z.ZodObject<{
    body: z.ZodObject<{
        factoryCode: z.ZodString;
        factoryName: z.ZodString;
        industryType: z.ZodString;
        factoryLocation: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const updateFactorySchema: z.ZodObject<{
    body: z.ZodObject<{
        factoryName: z.ZodOptional<z.ZodString>;
        industryType: z.ZodOptional<z.ZodString>;
        factoryLocation: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const getFactoriesQuerySchema: z.ZodObject<{
    query: z.ZodObject<{
        page: z.ZodPipe<z.ZodOptional<z.ZodString>, z.ZodTransform<number, string | undefined>>;
        limit: z.ZodPipe<z.ZodOptional<z.ZodString>, z.ZodTransform<number, string | undefined>>;
        industryType: z.ZodOptional<z.ZodString>;
        factoryLocation: z.ZodOptional<z.ZodString>;
        search: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
export type CreateFactoryInput = z.infer<typeof createFactorySchema>['body'];
export type UpdateFactoryInput = z.infer<typeof updateFactorySchema>['body'];
export type GetFactoriesQuery = z.infer<typeof getFactoriesQuerySchema>['query'];
//# sourceMappingURL=factory.schema.d.ts.map