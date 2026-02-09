"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBaysQuerySchema = exports.updateBaySchema = exports.createBaySchema = void 0;
const zod_1 = require("zod");
exports.createBaySchema = zod_1.z.object({
    params: zod_1.z.object({
        factoryId: zod_1.z.string(),
    }),
    body: zod_1.z.object({
        bayName: zod_1.z.string().min(2).max(50),
        maxMachineCapacity: zod_1.z.number().int().min(1).max(1000),
        isActive: zod_1.z.boolean().optional().default(true),
    }),
});
exports.updateBaySchema = zod_1.z.object({
    params: zod_1.z.object({
        bayId: zod_1.z.string(),
    }),
    body: zod_1.z.object({
        bayName: zod_1.z.string().min(2).max(50).optional(),
        maxMachineCapacity: zod_1.z.number().int().min(1).max(1000).optional(),
        isActive: zod_1.z.boolean().optional(),
    }),
});
exports.getBaysQuerySchema = zod_1.z.object({
    query: zod_1.z.object({
        page: zod_1.z
            .string()
            .optional()
            .transform((val) => parseInt(val || '1', 10)),
        limit: zod_1.z
            .string()
            .optional()
            .transform((val) => Math.min(parseInt(val || '20', 10), 100)),
        factoryId: zod_1.z
            .string()
            .optional()
            .transform((val) => (val ? parseInt(val, 10) : undefined)),
        isActive: zod_1.z
            .string()
            .optional()
            .transform((val) => val === undefined ? undefined : val.toLowerCase() === 'true'),
    }),
});
//# sourceMappingURL=bay.schema.js.map