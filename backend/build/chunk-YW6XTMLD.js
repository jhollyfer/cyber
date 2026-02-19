import {
  HTTPException
} from "./chunk-L747NW6V.js";
import {
  loadControllers
} from "./chunk-CUV44AAQ.js";
import {
  registerDependencies
} from "./chunk-IRSSYE5O.js";
import {
  Env
} from "./chunk-OQ2TB6G7.js";
import {
  __name
} from "./chunk-SHUYVCID.js";

// start/kernel.ts
import "reflect-metadata";
import cookie from "@fastify/cookie";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import swagger from "@fastify/swagger";
import scalar from "@scalar/fastify-api-reference";
import fastify from "fastify";
import { bootstrap } from "fastify-decorators";
import z, { ZodError } from "zod";
var kernel = fastify({
  logger: false,
  ajv: {
    customOptions: {
      allErrors: true
    }
  }
});
kernel.register(cors, {
  origin: /* @__PURE__ */ __name((origin, callback) => {
    const allowedOrigins = [
      Env.CLIENT_URL,
      Env.SERVER_URL
    ];
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS"), false);
  }, "origin"),
  methods: [
    "GET",
    "POST",
    "PUT",
    "DELETE",
    "PATCH",
    "OPTIONS"
  ],
  credentials: true,
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "Cookie",
    "X-Requested-With",
    "Accept",
    "Origin",
    "Access-Control-Request-Method",
    "Access-Control-Request-Headers"
  ],
  exposedHeaders: [
    "Set-Cookie"
  ],
  optionsSuccessStatus: 200,
  preflightContinue: false,
  preflight: true
});
kernel.register(cookie, {
  secret: Env.COOKIE_SECRET
});
var expiresIn = 60 * 60 * 24 * 1;
kernel.register(jwt, {
  secret: {
    private: Buffer.from(Env.JWT_PRIVATE_KEY, "base64"),
    public: Buffer.from(Env.JWT_PUBLIC_KEY, "base64")
  },
  sign: {
    expiresIn,
    algorithm: "RS256"
  },
  verify: {
    algorithms: [
      "RS256"
    ]
  },
  cookie: {
    signed: false,
    cookieName: "accessToken"
  }
});
kernel.setErrorHandler((error, _, response) => {
  console.error(error);
  if (error instanceof HTTPException) {
    return response.status(error.code).send({
      message: error.message,
      code: error.code,
      cause: error.cause
    });
  }
  if (error instanceof ZodError) {
    const fieldErrors = z.flattenError(error).fieldErrors;
    const errors = Object.entries(fieldErrors).reduce((acc, [key, [value]]) => {
      acc[key] = value;
      return acc;
    }, {});
    return response.status(400).send({
      message: "Invalid request",
      code: 400,
      cause: "INVALID_PAYLOAD_FORMAT",
      errors
    });
  }
  if (error.code === "FST_ERR_VALIDATION") {
    const validation = error.validation;
    const errors = validation.reduce((acc, err) => {
      const field = err.instancePath ? err.instancePath.slice(1) : err.params?.errors?.[0]?.params?.missingProperty || "unknown";
      if (err.message && field) {
        acc[field] = err.message;
      }
      return acc;
    }, {});
    return response.status(Number(error.statusCode)).send({
      message: "Invalid request",
      code: error.statusCode,
      cause: "INVALID_PAYLOAD_FORMAT",
      ...Object.keys(errors).length > 0 && {
        errors
      }
    });
  }
  return response.status(500).send({
    message: "Internal server error",
    cause: "SERVER_ERROR",
    code: 500
  });
});
kernel.register(swagger, {
  openapi: {
    info: {
      title: "CyberGuardian API",
      version: "1.0.0",
      description: "CyberGuardian API with JWT cookie-based authentication"
    },
    servers: [
      {
        url: Env.SERVER_URL,
        description: "Server URL"
      }
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "accessToken"
        }
      }
    }
  }
});
kernel.register(scalar, {
  routePrefix: "/documentation",
  configuration: {
    title: "CyberGuardian API",
    description: "CyberGuardian API Documentation",
    version: "1.0.0",
    theme: "default"
  }
});
registerDependencies();
kernel.register(bootstrap, {
  controllers: [
    ...await loadControllers()
  ]
});
kernel.get("/health", async (_request, response) => {
  return response.status(200).send({
    status: "ok"
  });
});
kernel.get("/openapi.json", async function() {
  return kernel.swagger();
});

export {
  kernel
};
