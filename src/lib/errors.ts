export class ApiError extends Error {
  code?: string;
  data?: Record<string, unknown>;

  constructor(message: string, code?: string, data?: Record<string, unknown>) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.data = data;
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

export function isApplicationLockedError(error: unknown): boolean {
  return isApiError(error) && (error.code === 'APPLICATION_LOCKED' || error.message.includes('locked'));
}
