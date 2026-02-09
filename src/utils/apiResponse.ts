export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: {
        code: string;
        message: string;
        details?: any;
    };
    meta?: {
        page?: number;
        limit?: number;
        total?: number;
        totalPages?: number;
    };
}

export const successResponse = <T>(
    data: T,
    meta?: ApiResponse<T>['meta']
): ApiResponse<T> => ({
    success: true,
    data,
    ...(meta !== undefined && { meta }),
});

export const errorResponse = (
    code: string,
    message: string,
    details?: any
): ApiResponse<never> => ({
    success: false,
    error: { code, message, details },
});