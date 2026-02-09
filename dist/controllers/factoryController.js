"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FactoryController = void 0;
const factoryService_1 = require("../services/factoryService");
const apiResponse_1 = require("../utils/apiResponse");
const factoryService = new factoryService_1.FactoryService();
class FactoryController {
    async getAll(req, res, next) {
        try {
            const { factories, meta } = await factoryService.getAll(req.query);
            res.json((0, apiResponse_1.successResponse)(factories, meta));
        }
        catch (error) {
            next(error);
        }
    }
    async getById(req, res, next) {
        try {
            const factoryId = parseInt(String(req.params.factoryId ?? ''), 10);
            const include = req.query.include?.toString().split(',');
            const factory = await factoryService.getById(factoryId, include);
            res.json((0, apiResponse_1.successResponse)(factory));
        }
        catch (error) {
            next(error);
        }
    }
    async create(req, res, next) {
        try {
            const factory = await factoryService.create(req.body);
            res.status(201).json((0, apiResponse_1.successResponse)(factory));
        }
        catch (error) {
            next(error);
        }
    }
    async update(req, res, next) {
        try {
            const factoryId = parseInt(String(req.params.factoryId ?? ''), 10);
            const factory = await factoryService.update(factoryId, req.body);
            res.json((0, apiResponse_1.successResponse)(factory));
        }
        catch (error) {
            next(error);
        }
    }
    async delete(req, res, next) {
        try {
            const factoryId = parseInt(String(req.params.factoryId ?? ''), 10);
            await factoryService.delete(factoryId);
            res.status(204).send();
        }
        catch (error) {
            next(error);
        }
    }
}
exports.FactoryController = FactoryController;
//# sourceMappingURL=factoryController.js.map