import {
  __name
} from "./chunk-SHUYVCID.js";

// application/core/exception.ts
var HTTPException = class _HTTPException extends Error {
  static {
    __name(this, "HTTPException");
  }
  code;
  cause;
  constructor(payload) {
    super(payload.message);
    this.cause = payload.cause;
    this.code = payload.code;
  }
  static BadRequest(message = "Bad Request", cause = "INVALID_PARAMETERS") {
    return new _HTTPException({
      message,
      code: 400,
      cause
    });
  }
  static Unauthorized(message = "Unauthorized", cause = "AUTHENTICATION_REQUIRED") {
    return new _HTTPException({
      message,
      code: 401,
      cause
    });
  }
  static Forbidden(message = "Forbidden", cause = "ACCESS_DENIED") {
    return new _HTTPException({
      message,
      code: 403,
      cause
    });
  }
  static NotFound(message = "Not Found", cause = "RESOURCE_NOT_FOUND") {
    return new _HTTPException({
      message,
      code: 404,
      cause
    });
  }
  static Conflict(message = "Conflict", cause = "CONFLICT_IN_REQUEST") {
    return new _HTTPException({
      message,
      code: 409,
      cause
    });
  }
  static UnprocessableEntity(message = "Unprocessable Entity", cause = "UNPROCESSABLE_ENTITY") {
    return new _HTTPException({
      message,
      code: 422,
      cause
    });
  }
  static TooManyRequests(message = "Too Many Requests", cause = "TOO_MANY_REQUESTS") {
    return new _HTTPException({
      message,
      code: 429,
      cause
    });
  }
  static InternalServerError(message = "Internal Server Error", cause = "SERVER_ERROR") {
    return new _HTTPException({
      message,
      code: 500,
      cause
    });
  }
};

export {
  HTTPException
};
