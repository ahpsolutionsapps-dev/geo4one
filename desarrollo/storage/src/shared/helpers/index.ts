import { PaginationParams, PaginatedResult } from '../types';

export function normalizePagination(
  page?: number,
  limit?: number,
): PaginationParams {
  const safePage = page && page > 0 ? page : 1;
  const safeLimit = limit && limit > 0 && limit <= 100 ? limit : 20;
  return { page: safePage, limit: safeLimit };
}

export function toPaginatedResult<T>(
  items: T[],
  total: number,
  pagination: PaginationParams,
): PaginatedResult<T> {
  return {
    items,
    total,
    page: pagination.page,
    limit: pagination.limit,
    totalPages: Math.max(1, Math.ceil(total / pagination.limit)),
  };
}

export function sanitizeFileName(fileName: string): string {
  return fileName
    .replace(/[/\\?%*:|"<>]/g, '_')
    .replace(/\.\./g, '_')
    .trim();
}

export function getExtension(fileName: string): string {
  const parts = fileName.split('.');
  if (parts.length < 2) return '';
  return parts.pop()!.toLowerCase();
}

export function buildDateStoragePath(date = new Date()): string {
  const year = date.getFullYear().toString();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}/${month}/${day}`;
}
