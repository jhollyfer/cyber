import {
  __name
} from "./chunk-SHUYVCID.js";

// application/utils/password.utils.ts
import bcrypt from "bcryptjs";
var SALT_ROUNDS = 10;
var hashPassword = /* @__PURE__ */ __name(async (password) => {
  return bcrypt.hash(password, SALT_ROUNDS);
}, "hashPassword");
var comparePassword = /* @__PURE__ */ __name(async (password, hash) => {
  return bcrypt.compare(password, hash);
}, "comparePassword");

export {
  hashPassword,
  comparePassword
};
