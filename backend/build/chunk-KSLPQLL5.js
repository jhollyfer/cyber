import {
  Env
} from "./chunk-OQ2TB6G7.js";
import {
  __name
} from "./chunk-SHUYVCID.js";

// application/utils/cookies.utils.ts
var setCookieTokens = /* @__PURE__ */ __name((response, tokens) => {
  const cookieOptions = {
    path: "/",
    secure: Env.NODE_ENV === "production",
    sameSite: Env.NODE_ENV === "production" ? "none" : "lax",
    httpOnly: true,
    ...Env.COOKIE_DOMAIN && {
      domain: Env.COOKIE_DOMAIN
    }
  };
  response.setCookie("accessToken", tokens.accessToken, {
    ...cookieOptions,
    maxAge: 60 * 60 * 24 * 1e3
  }).setCookie("refreshToken", tokens.refreshToken, {
    ...cookieOptions,
    maxAge: 60 * 60 * 7 * 24 * 1e3
  });
}, "setCookieTokens");
var clearCookieTokens = /* @__PURE__ */ __name((response) => {
  const cookieOptions = {
    path: "/",
    secure: Env.NODE_ENV === "production",
    sameSite: Env.NODE_ENV === "production" ? "none" : "lax",
    httpOnly: true,
    ...Env.COOKIE_DOMAIN && {
      domain: Env.COOKIE_DOMAIN
    }
  };
  response.clearCookie("accessToken", cookieOptions).clearCookie("refreshToken", cookieOptions);
}, "clearCookieTokens");

export {
  setCookieTokens,
  clearCookieTokens
};
