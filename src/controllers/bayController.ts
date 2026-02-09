import type { Request, Response, NextFunction } from 'express';
import { BayService } from '../services/bayService';
import { successResponse } from '../utils/apiResponse';

const bayService = new BayService();

export class BayController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { bays, meta } = await bayService.getAll(req.query as any);
      res.json(successResponse(bays, meta));
    } catch (error) {
      next(error);
    }
  }

  async getByFactory(req: Request, res: Response, next: NextFunction) {
    try {
      const factoryId = parseInt(String(req.params.factoryId ?? ''), 10);
      const bays = await bayService.getByFactory(factoryId);
      res.json(successResponse(bays));
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const bayId = parseInt(String(req.params.bayId ?? ''), 10);
      const bay = await bayService.getById(bayId);
      res.json(successResponse(bay));
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const factoryId = parseInt(String(req.params.factoryId ?? ''), 10);
      const bay = await bayService.create(factoryId, req.body);
      res.status(201).json(successResponse(bay));
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const bayId = parseInt(String(req.params.bayId ?? ''), 10);
      const bay = await bayService.update(bayId, req.body);
      res.json(successResponse(bay));
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const bayId = parseInt(String(req.params.bayId ?? ''), 10);
      await bayService.delete(bayId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

