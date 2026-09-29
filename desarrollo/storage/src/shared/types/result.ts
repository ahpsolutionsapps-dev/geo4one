import { AppError } from '../errors/app-error';

export type Result<T> =
  | { success: true; value: T }
  | { success: false; error: AppError };

export function ok<T>(value: T): Result<T> {
  return { success: true, value };
}

export function fail<T>(error: AppError): Result<T> {
  return { success: false, error };
}

export function isOk<T>(result: Result<T>): result is { success: true; value: T } {
  return result.success;
}

export function isFail<T>(
  result: Result<T>,
): result is { success: false; error: AppError } {
  return !result.success;
}
