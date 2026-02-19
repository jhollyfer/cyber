import {
  __name
} from "./chunk-SHUYVCID.js";

// application/middlewares/request-logger.middleware.ts
function RequestLoggerMiddleware(app) {
  app.addHook("onRequest", (request, _reply, done) => {
    console.log(`[REQUEST] ${request.method} ${request.url}`);
    done();
  });
  app.addHook("onResponse", (request, reply, done) => {
    const duration = reply.elapsedTime.toFixed(2);
    console.log(`[RESPONSE] ${request.method} ${request.url} - ${reply.statusCode} (${duration}ms)`);
    done();
  });
}
__name(RequestLoggerMiddleware, "RequestLoggerMiddleware");

export {
  RequestLoggerMiddleware
};
