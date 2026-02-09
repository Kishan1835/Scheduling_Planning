import type { Request, Response, NextFunction } from 'express';
import { FactoryService } from '../services/factoryService';
import { successResponse } from '../utils/apiResponse';

const factoryService = new FactoryService();

export class FactoryController {
    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const { factories, meta } = await factoryService.getAll(req.query as any);
            res.json(successResponse(factories, meta));
        } catch (error) {
            next(error);
        }
    }

    async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const factoryId = parseInt(String(req.params.factoryId ?? ''), 10);
            const include = req.query.include?.toString().split(',');

            const factory = await factoryService.getById(factoryId, include);
            res.json(successResponse(factory));
        } catch (error) {
            next(error);
        }
    }

    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const factory = await factoryService.create(req.body);
            res.status(201).json(successResponse(factory));
        } catch (error) {
            next(error);
        }
    }

    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const factoryId = parseInt(String(req.params.factoryId ?? ''), 10);
            const factory = await factoryService.update(factoryId, req.body);
            res.json(successResponse(factory));
        } catch (error) {
            next(error);
        }
    }

    async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const factoryId = parseInt(String(req.params.factoryId ?? ''), 10);
            await factoryService.delete(factoryId);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
}