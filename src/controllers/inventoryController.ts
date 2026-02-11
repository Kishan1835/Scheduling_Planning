import { Request, Response, NextFunction } from 'express';
import { InventoryService } from '../services/inventoryService';
import { successResponse } from '../utils/apiResponse';

const service = new InventoryService();

export class InventoryController {
    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const factoryId = parseInt(String(req.params.factoryId ?? ''), 10);
            const inventory = await service.create(factoryId, req.body);
            res.status(201).json(successResponse(inventory));
        } catch (error) {
            next(error);
        }
    }

    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const inventory = await service.getAll(req.query as any);
            res.json(successResponse(inventory));
        } catch (error) {
            next(error);
        }
    }

    async getByFactory(req: Request, res: Response, next: NextFunction) {
        try {
            const factoryId = parseInt(String(req.params.factoryId ?? ''), 10);
            const inventory = await service.getByFactory(factoryId);
            res.json(successResponse(inventory));
        } catch (error) {
            next(error);
        }
    }

    async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const inventoryId = parseInt(String(req.params.inventoryId ?? ''), 10);
            const inventory = await service.getById(inventoryId);
            res.json(successResponse(inventory));
        } catch (error) {
            next(error);
        }
    }

    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const inventoryId = parseInt(String(req.params.inventoryId ?? ''), 10);
            const inventory = await service.update(inventoryId, req.body);
            res.json(successResponse(inventory));
        } catch (error) {
            next(error);
        }
    }

    async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const inventoryId = parseInt(String(req.params.inventoryId ?? ''), 10);
            await service.delete(inventoryId);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
}