export type ApiErrorBody = {
  code: string;
  message: string;
  details: unknown;
};

export class AppError extends Error {
  readonly statusCode: number;
  readonly code: string;
  readonly details: unknown;

  constructor(statusCode: number, code: string, message: string, details: unknown = null) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

export function notImplemented(hu: string) {
  return async () => {
    throw new AppError(501, "NOT_IMPLEMENTED", `Pendiente ${hu}`);
  };
}
