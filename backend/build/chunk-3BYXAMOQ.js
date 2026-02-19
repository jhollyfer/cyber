import {
  __name
} from "./chunk-SHUYVCID.js";

// application/utils/jwt.utils.ts
var createTokens = /* @__PURE__ */ __name(async (user, response) => {
  const jwt = {
    sub: user.id.toString(),
    phone: user.phone,
    role: user.role,
    type: "access"
  };
  const accessToken = await response.jwtSign(jwt, {
    sub: user.id.toString(),
    expiresIn: "24h"
  });
  const refreshToken = await response.jwtSign({
    sub: user.id.toString(),
    type: "refresh"
  }, {
    sub: user.id.toString(),
    expiresIn: "7d"
  });
  return {
    accessToken,
    refreshToken
  };
}, "createTokens");

export {
  createTokens
};
