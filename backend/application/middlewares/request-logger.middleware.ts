import type { FastifyInstance } from 'fastify';

export function RequestLoggerMiddleware(app: FastifyInstance): void {
  app.addHook('onRequest', (request, _reply, done) => {
    console.log(`[REQUEST] ${request.method} ${request.url}`);
    done();
  });

  app.addHook('onResponse', (request, reply, done) => {
    const duration = reply.elapsedTime.toFixed(2);
    console.log(
      `[RESPONSE] ${request.method} ${request.url} - ${reply.statusCode} (${duration}ms)`,
    );
    done();
  });
}
