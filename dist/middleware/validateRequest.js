"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = void 0;
const apiResponse_1 = require("../utils/apiResponse");
const validateRequest = (schema) => (req, res, next) => {
    const result = schema.safeParse({
        body: req.body,
        query: req.query,
        params: req.params,
    });
    if (!result.success) {
        const { issues } = result.error;
        return res
            .status(400)
            .json((0, apiResponse_1.errorResponse)('VALIDATION_ERROR', 'Request validation failed', issues));
    }
    const value = result.data;
    if (value.body)
        req.body = value.body;
    if (value.query)
        req.query = value.query;
    if (value.params)
        req.params = value.params;
    next();
};
exports.validateRequest = validateRequest;
//# sourceMappingURL=validateRequest.js.map