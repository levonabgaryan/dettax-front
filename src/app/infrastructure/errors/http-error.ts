import { InfrastructureError } from './infrastructure-error';

export class HttpError extends InfrastructureError {
  constructor(statusCode: number, cause?: unknown) {
    super(`HTTP ${statusCode}`, cause);
  }
}
