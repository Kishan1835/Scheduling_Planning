import type { Request, Response, NextFunction } from 'express';
export declare class BayController {
    getAll(req: Request, res: Response, next: NextFunction): Promise<void>;
    getByFactory(req: Request, res: Response, next: NextFunction): Promise<void>;
    getById(req: Request, res: Response, next: NextFunction): Promise<void>;
    create(req: Request, res: Response, next: NextFunction): Promise<void>;
    update(req: Request, res: Response, next: NextFunction): Promise<void>;
    delete(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=bayController.d.ts.map