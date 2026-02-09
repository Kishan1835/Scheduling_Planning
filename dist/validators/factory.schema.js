"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFactoriesQuerySchema = exports.updateFactorySchema = exports.createFactorySchema = void 0;
const zod_1 = require("zod");
exports.createFactorySchema = zod_1.z.object({
    body: zod_1.z.object({
        factoryCode: zod_1.z.string().min(3).max(20),
        factoryName: zod_1.z.string().min(3).max(100),
        industryType: zod_1.z.string().min(2).max(50),
        factoryLocation: zod_1.z.string().min(3).max(200),
    }),
});
exports.updateFactorySchema = zod_1.z.object({
    body: zod_1.z.object({
        factoryName: zod_1.z.string().min(3).max(100).optional(),
        industryType: zod_1.z.string().min(2).max(50).optional(),
        factoryLocation: zod_1.z.string().min(3).max(200).optional(),
    }),
});
exports.getFactoriesQuerySchema = zod_1.z.object({
    query: zod_1.z.object({
        page: zod_1.z.string().optional().transform(val => parseInt(val || '1')),
        limit: zod_1.z.string().optional().transform(val => Math.min(parseInt(val || '20'), 100)),
        industryType: zod_1.z.string().optional(),
        factoryLocation: zod_1.z.string().optional(),
        search: zod_1.z.string().optional(),
    }),
});
//# sourceMappingURL=factory.schema.js.map