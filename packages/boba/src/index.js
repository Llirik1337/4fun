import { stat } from "fs/promises";
import { createContext, runInContext } from "vm";
import { findAllFiles } from "./utils/findAllFiles.js";
import { readFile } from "./utils/readFile.js";

const nodeModules = ["os", "fs", "net", "http", "cluster", "process"];

const loadModules = async (names) => {
  const modules = {};
  await Promise.all(
    names.map((depName) =>
      import(depName).then((module) => (modules[depName] = module))
    )
  );
  return modules;
};
const getNpmModulesNames = async () => {
  const packageJsonFile = await readFile("package.json");
  const packageJson = JSON.parse(packageJsonFile);
  const { dependencies = {} } = packageJson || {};
  return Object.keys(dependencies);
};

/**
 *
 * @param {string[]} dirs
 */
export const initApp = async (dirs) => {
  const stats = await Promise.all(
    dirs.map((filename) =>
      stat(filename).then((statInfo) =>
        Object.assign(statInfo, { name: filename })
      )
    )
  );

  const filesPacks = await Promise.all(
    stats.map((info) =>
      info.isFile() ? Promise.resolve(info.name) : findAllFiles(info.name)
    )
  );

  const filesBody = await Promise.all(
    filesPacks
      .flat()
      .map((filePath) =>
        readFile(filePath).then((body) => ({ filePath, body }))
      )
  );

  const [npm, node] = await Promise.all([
    loadModules(await getNpmModulesNames()),
    loadModules(nodeModules),
  ]);

  filesBody.reduce((acc, { filePath, body }) => {
    const newLocal = runInContext(
      `'use strict';\n()=>${body};`,
      createContext({
        console,
        Math,
        Buffer,
        npm,
        node,
        ...acc,
      }),
      {
        filename: filePath,
      }
    )();
    const { name, ...module } =
      typeof newLocal === "function" ? newLocal() || {} : newLocal;

    const moduleName = name || newLocal.name;
    if (moduleName) acc[moduleName] = module;

    return acc;
  }, {});
};
