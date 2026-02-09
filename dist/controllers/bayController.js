"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BayController = void 0;
const bayService_1 = require("../services/bayService");
const apiResponse_1 = require("../utils/apiResponse");
const bayService = new bayService_1.BayService();
class BayController {
    async getAll(req, res, next) {
        try {
            const { bays, meta } = await bayService.getAll(req.query);
            res.json((0, apiResponse_1.successResponse)(bays, meta));
        }
        catch (error) {
            next(error);
        }
    }
    async getByFactory(req, res, next) {
        try {
            const factoryId = parseInt(String(req.params.factoryId ?? ''), 10);
            const bays = await bayService.getByFactory(factoryId);
            res.json((0, apiResponse_1.successResponse)(bays));
        }
        catch (error) {
            next(error);
        }
    }
    async getById(req, res, next) {
        try {
            const bayId = parseInt(String(req.params.bayId ?? ''), 10);
            const bay = await bayService.getById(bayId);
            res.json((0, apiResponse_1.successResponse)(bay));
        }
        catch (error) {
            next(error);
        }
    }
    async create(req, res, next) {
        try {
            const factoryId = parseInt(String(req.params.factoryId ?? ''), 10);
            const bay = await bayService.create(factoryId, req.body);
            res.status(201).json((0, apiResponse_1.successResponse)(bay));
        }
        catch (error) {
            next(error);
        }
    }
    async update(req, res, next) {
        try {
            const bayId = parseInt(String(req.params.bayId ?? ''), 10);
            const bay = await bayService.update(bayId, req.body);
            res.json((0, apiResponse_1.successResponse)(bay));
        }
        catch (error) {
            next(error);
        }
    }
    async delete(req, res, next) {
        try {
            const bayId = parseInt(String(req.params.bayId ?? ''), 10);
            await bayService.delete(bayId);
            res.status(204).send();
        }
        catch (error) {
            next(error);
        }
    }
}
exports.BayController = BayController;
//# sourceMappingURL=bayController.js.map