import "server-only";
import { handleActionError, shouldRethrow } from "@open-auth/core";

export class ActionWrapperService {
  /**
   * Wrap a server action with error handling
   * Catches all errors and returns user-friendly error messages
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public withErrorHandling<T extends (...args: any[]) => Promise<any>>(
    action: T,
    actionName?: string
  ): T {
    return (async (...args: Parameters<T>): Promise<ReturnType<T>> => {
      try {
        return await action(...args);
      } catch (error) {
        // Re-throw redirects and other special errors
        if (shouldRethrow(error)) {
          throw error;
        }

        // Extract userId from context if available (for logging)
        const userId: string | undefined = undefined;
        // Session lookup removed to avoid singleton dependency

        // Handle the error and return appropriate result
        return handleActionError<Awaited<ReturnType<T>>>(
          error,
          actionName,
          userId
        ) as ReturnType<T>;
      }
    }) as T;
  }

  /**
   * Wrap a server action with error handling and custom error handler
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public withErrorHandlingCustom<T extends (...args: any[]) => Promise<any>>(
    action: T,
    options: {
      actionName?: string;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onError?: (error: unknown, actionName?: string) => ReturnType<T>;
    }
  ): T {
    return (async (...args: Parameters<T>): Promise<ReturnType<T>> => {
      try {
        return await action(...args);
      } catch (error) {
        // Re-throw redirects and other special errors
        if (shouldRethrow(error)) {
          throw error;
        }

        // Use custom error handler if provided
        if (options.onError) {
          return options.onError(error, options.actionName);
        }

        // Extract userId from context if available (for logging)
        const userId: string | undefined = undefined;
        // Session lookup removed to avoid singleton dependency

        // Handle the error and return appropriate result
        return handleActionError<Awaited<ReturnType<T>>>(
          error,
          options.actionName,
          userId
        ) as ReturnType<T>;
      }
    }) as T;
  }
}

export const actionWrapperService = new ActionWrapperService();

export const withErrorHandling =
  actionWrapperService.withErrorHandling.bind(actionWrapperService);
export const withErrorHandlingCustom =
  actionWrapperService.withErrorHandlingCustom.bind(actionWrapperService);
