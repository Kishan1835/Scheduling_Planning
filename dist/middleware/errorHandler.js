"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const apiResponse_1 = require("../utils/apiResponse");
const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);
    // Zod validation errors
    if (err instanceof zod_1.ZodError) {
        return res.status(400).json((0, apiResponse_1.errorResponse)('VALIDATION_ERROR', 'Request validation failed', err.issues));
    }
    // Prisma unique constraint violation
    if (err instanceof client_1.Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
            return res.status(409).json((0, apiResponse_1.errorResponse)('CONFLICT', 'Resource already exists', { field: err.meta?.target }));
        }
        if (err.code === 'P2025') {
            return res.status(404).json((0, apiResponse_1.errorResponse)('RESOURCE_NOT_FOUND', 'Resource not found'));
        }
    }
    // Custom business rule errors
    if (err.name === 'BusinessRuleError') {
        return res.status(422).json((0, apiResponse_1.errorResponse)('BUSINESS_RULE_VIOLATION', err.message, err.details));
    }
    // Default error
    res.status(500).json((0, apiResponse_1.errorResponse)('INTERNAL_SERVER_ERROR', 'An unexpected error occurred'));
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=errorHandler.js.map