import type { Request, Response, NextFunction } from 'express';
import type { ZodSchema } from 'zod';
import { errorResponse } from '../utils/apiResponse';

export const validateRequest =
  (schema: ZodSchema) =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    if (!result.success) {
      const { issues } = result.error;
      return res
        .status(400)
        .json(
          errorResponse('VALIDATION_ERROR', 'Request validation failed', issues),
        );
    }

    const value = result.data as any;
    if (value.body) req.body = value.body;
    // req.query and req.params are read-only; mutate in place to apply validated/transformed values
    if (value.query) Object.assign(req.query, value.query);
    if (value.params) Object.assign(req.params, value.params);

    next();
  };

