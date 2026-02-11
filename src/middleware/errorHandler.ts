import type { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';
import { errorResponse } from '../utils/apiResponse';

export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.error('Error:', err);

    // Zod validation errors
    if (err instanceof ZodError) {
        return res.status(400).json(
            errorResponse('VALIDATION_ERROR', 'Request validation failed', err.issues)
        );
    }

    // Prisma unique constraint violation
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
            return res.status(409).json(
                errorResponse('CONFLICT', 'Resource already exists', { field: err.meta?.target })
            );
        }
        if (err.code === 'P2025') {
            return res.status(404).json(
                errorResponse('RESOURCE_NOT_FOUND', 'Resource not found')
            );
        }
        if (err.code === 'P2003') {
            return res.status(404).json(
                errorResponse('RESOURCE_NOT_FOUND', 'Referenced resource not found (e.g. factory does not exist)')
            );
        }
    }

    if ((err as Error & { code?: string }).code === 'FACTORY_NOT_FOUND') {
        return res.status(404).json(
            errorResponse('RESOURCE_NOT_FOUND', 'Factory not found')
        );
    }

    // Custom business rule errors
    if (err.name === 'BusinessRuleError') {
        return res.status(422).json(
            errorResponse('BUSINESS_RULE_VIOLATION', err.message, (err as any).details)
        );
    }

    // Default error
    res.status(500).json(
        errorResponse('INTERNAL_SERVER_ERROR', 'An unexpected error occurred')
    );
};