import {
  __name
} from "../../chunk-SHUYVCID.js";

// application/core/utils.ts
function isNil(value) {
  return value === null || value === void 0;
}
__name(isNil, "isNil");
function isDefined(value) {
  return value !== null && value !== void 0;
}
__name(isDefined, "isDefined");
function omitUndefined(obj) {
  return Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== void 0));
}
__name(omitUndefined, "omitUndefined");
function typedKeys(obj) {
  return Object.keys(obj);
}
__name(typedKeys, "typedKeys");
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}
__name(clamp, "clamp");
function randomHex(bytes = 16) {
  return Array.from({
    length: bytes
  }, () => Math.floor(Math.random() * 256).toString(16).padStart(2, "0")).join("");
}
__name(randomHex, "randomHex");
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
__name(sleep, "sleep");
function normalisePagination(page, perPage) {
  const p = clamp(page ?? 1, 1, Number.MAX_SAFE_INTEGER);
  const pp = clamp(perPage ?? 20, 1, 100);
  return {
    page: p,
    per_page: pp,
    offset: (p - 1) * pp
  };
}
__name(normalisePagination, "normalisePagination");
export {
  clamp,
  isDefined,
  isNil,
  normalisePagination,
  omitUndefined,
  randomHex,
  sleep,
  typedKeys
};
