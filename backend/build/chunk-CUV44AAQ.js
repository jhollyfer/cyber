import {
  Env
} from "./chunk-OQ2TB6G7.js";
import {
  __name
} from "./chunk-SHUYVCID.js";

// application/core/controllers.ts
import { readdir } from "fs/promises";
import { join } from "path";
var isDevOrTest = [
  "development"
].includes(Env.NODE_ENV);
var controllerPattern = /^(?!.*\.spec\.).*\.controller\.(ts|js)$/;
async function loadControllers() {
  const controllers = [];
  const controllersPath = join(process.cwd(), "application/resources");
  const files = await readdir(controllersPath, {
    recursive: true
  });
  const controllerFiles = files.filter((file) => controllerPattern.test(file)).sort((a, b) => a.localeCompare(b));
  for (const file of controllerFiles) {
    const module = await import(join(controllersPath, file));
    controllers.push(module.default);
    if (isDevOrTest) {
      console.info(`\u2705 Controller ${file} loaded`);
    }
  }
  if (isDevOrTest) {
    console.info(`\u2705 ${controllers.length} controllers loaded`);
  }
  return controllers;
}
__name(loadControllers, "loadControllers");

export {
  loadControllers
};
