import {
  HTTPException
} from "./chunk-L747NW6V.js";
import {
  __name
} from "./chunk-SHUYVCID.js";

// application/middlewares/authentication.middleware.ts
function AuthenticationMiddleware(options = {
  optional: false
}) {
  return async function(request) {
    try {
      const accessToken = request.cookies.accessToken;
      if (!accessToken) {
        if (options.optional) return;
        throw HTTPException.Unauthorized("Authentication required", "AUTHENTICATION_REQUIRED");
      }
      const accessTokenDecoded = await request.server.jwt.decode(String(accessToken));
      if (!accessTokenDecoded || accessTokenDecoded.type !== "access") {
        if (options.optional) return;
        throw HTTPException.Unauthorized("Authentication required", "AUTHENTICATION_REQUIRED");
      }
      request.user = {
        sub: accessTokenDecoded.sub,
        phone: accessTokenDecoded.phone,
        role: accessTokenDecoded.role,
        type: "access"
      };
    } catch (error) {
      if (options.optional) return;
      console.error("Authentication error:", error);
      throw HTTPException.Unauthorized("Authentication required", "AUTHENTICATION_REQUIRED");
    }
  };
}
__name(AuthenticationMiddleware, "AuthenticationMiddleware");

export {
  AuthenticationMiddleware
};
