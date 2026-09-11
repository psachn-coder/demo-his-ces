export interface ApiError {
  code: string
  message: string
  details?: Record<string, unknown>
}

export type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: ApiError }

export function ok<T>(data: T): ApiResult<T> {
  return { ok: true, data }
}

export function fail<T>(error: ApiError): ApiResult<T> {
  return { ok: false, error }
}
