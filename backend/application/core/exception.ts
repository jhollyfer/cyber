export interface Exception {
  message: string;
  code: number;
  cause: string;
}

export default class HTTPException extends Error {
  public readonly code: number;
  public override readonly cause: string;

  private constructor(payload: Exception) {
    super(payload.message);
    this.cause = payload.cause;
    this.code = payload.code;
  }

  static BadRequest(
    message = 'Bad Request',
    cause = 'INVALID_PARAMETERS',
  ): HTTPException {
    return new HTTPException({ message, code: 400, cause });
  }

  static Unauthorized(
    message = 'Unauthorized',
    cause = 'AUTHENTICATION_REQUIRED',
  ): HTTPException {
    return new HTTPException({ message, code: 401, cause });
  }

  static Forbidden(
    message = 'Forbidden',
    cause = 'ACCESS_DENIED',
  ): HTTPException {
    return new HTTPException({ message, code: 403, cause });
  }

  static NotFound(
    message = 'Not Found',
    cause = 'RESOURCE_NOT_FOUND',
  ): HTTPException {
    return new HTTPException({ message, code: 404, cause });
  }

  static Conflict(
    message = 'Conflict',
    cause = 'CONFLICT_IN_REQUEST',
  ): HTTPException {
    return new HTTPException({ message, code: 409, cause });
  }

  static UnprocessableEntity(
    message = 'Unprocessable Entity',
    cause = 'UNPROCESSABLE_ENTITY',
  ): HTTPException {
    return new HTTPException({ message, code: 422, cause });
  }

  static TooManyRequests(
    message = 'Too Many Requests',
    cause = 'TOO_MANY_REQUESTS',
  ): HTTPException {
    return new HTTPException({ message, code: 429, cause });
  }

  static InternalServerError(
    message = 'Internal Server Error',
    cause = 'SERVER_ERROR',
  ): HTTPException {
    return new HTTPException({ message, code: 500, cause });
  }
}
