import { z } from "zod";

// Common schemas
export const emailSchema = z.string().email().min(1).max(255);
export const passwordSchema = z.string().min(8).max(128);
export const usernameSchema = z.string().min(3).max(50);
export const uuidSchema = z.string().uuid();
export const tokenSchema = z.string().min(1);

// Pagination
export const paginationSchema = z.object({
  limit: z.number().min(1).max(100).default(20),
  offset: z.number().min(0).default(0),
});

export type Pagination = z.infer<typeof paginationSchema>;

// API Response wrappers
export const successResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.literal(true),
    data: dataSchema,
  });

export const errorResponseSchema = z.object({
  success: z.literal(false),
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.record(z.unknown()).optional(),
  }),
});

export interface SuccessResponse<T> {
  success: true;
  data: T;
}

export type ErrorResponse = z.infer<typeof errorResponseSchema>;

export type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;
