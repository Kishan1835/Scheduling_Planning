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
export declare const successResponse: <T>(data: T, meta?: ApiResponse<T>["meta"]) => ApiResponse<T>;
export declare const errorResponse: (code: string, message: string, details?: any) => ApiResponse<never>;
//# sourceMappingURL=apiResponse.d.ts.map