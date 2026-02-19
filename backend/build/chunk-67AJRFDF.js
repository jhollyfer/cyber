import {
  __name
} from "./chunk-SHUYVCID.js";

// application/core/either.ts
var Left = class {
  static {
    __name(this, "Left");
  }
  value;
  constructor(value) {
    this.value = value;
  }
  isRight() {
    return false;
  }
  isLeft() {
    return true;
  }
};
var Right = class {
  static {
    __name(this, "Right");
  }
  value;
  constructor(value) {
    this.value = value;
  }
  isRight() {
    return true;
  }
  isLeft() {
    return false;
  }
};
var left = /* @__PURE__ */ __name((value) => {
  return new Left(value);
}, "left");
var right = /* @__PURE__ */ __name((value) => {
  return new Right(value);
}, "right");

export {
  Left,
  Right,
  left,
  right
};
