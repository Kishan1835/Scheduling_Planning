import { Request, Response, NextFunction } from 'express';
import { MachineTypeService } from '../services/machineTypeService';
import { successResponse } from '../utils/apiResponse';

const service = new MachineTypeService();

export class MachineTypeController {
    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const factoryId = parseInt(String(req.params.factoryId ?? ''), 10);
            const bayId = parseInt(String(req.params.bayId ?? ''), 10);

            const machineType = await service.create(factoryId, bayId, req.body);
            res.status(201).json(successResponse(machineType));
        } catch (error) {
            next(error);
        }
    }

    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const machineTypes = await service.getAll(req.query);
            res.json(successResponse(machineTypes));
        } catch (error) {
            next(error);
        }
    }

    async getByFactory(req: Request, res: Response, next: NextFunction) {
        try {
            const factoryId = parseInt(String(req.params.factoryId ?? ''), 10);
            const machineTypes = await service.getByFactory(factoryId);
            res.json(successResponse(machineTypes));
        } catch (error) {
            next(error);
        }
    }

    async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const machineTypeId = parseInt(String(req.params.machineTypeId ?? ''), 10);
            const machineType = await service.getById(machineTypeId);
            res.json(successResponse(machineType));
        } catch (error) {
            next(error);
        }
    }

    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const machineTypeId = parseInt(String(req.params.machineTypeId ?? ''), 10);
            const machineType = await service.update(machineTypeId, req.body);
            res.json(successResponse(machineType));
        } catch (error) {
            next(error);
        }
    }

    async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const machineTypeId = parseInt(String(req.params.machineTypeId ?? ''), 10);
            await service.delete(machineTypeId);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
}