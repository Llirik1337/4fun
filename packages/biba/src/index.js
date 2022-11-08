import EventEmitter from "events";
import http from "http";
import path from "path";
import { createContext, runInContext } from "vm";
import * as utils from "./utils/index.js";
export * as utils from "./utils/index.js";

/**
 * @typedef {(...args: any[]) => void} ListenerType
 */

/**
 * @typedef ApplicationOptions
 * @type {Object}
 * @property {string} [rootDir]
 * @property {[string,RegExp][]} [dirs = []]
 * @property {any} [logger = console]
 * @property {(filePath: string,module: any)=>string} [typeResolver]
 */

/**
 * Application
 */
export class Application extends EventEmitter {
  initStart = Symbol.for("init-start");
  initFinish = Symbol.for("init-finish");
  moduleLoaded = Symbol.for("module-loaded");

  /**
   * @param {ApplicationOptions} options
   */
  constructor(options) {
    super({ captureRejections: true });
    const {
      dirs = [],
      logger = console,
      rootDir = "",
      typeResolver = (_, module) => {
        const type = module.type;
        delete module.type;
        return type;
      },
    } = options;
    this.dirs = dirs;
    this.modules = new Map();
    this.logger = logger;
    this.rootDir = rootDir;
    this.typeResolver = typeResolver;
  }

  async loadModule(filePath) {
    const fileContext = await utils.readFile(filePath);
    const moduleBody = `'use strict';\n()=>${fileContext}`;
    const fn = runInContext(
      moduleBody,
      createContext({
        Math,
        Buffer,
        console: this.logger,
        setTimeout,
        setInterval,
        app: this,
        node: {
          http,
          path,
        },
      }),
      { filename: filePath, microtaskMode: "afterEvaluate" }
    );

    const result = fn();

    if (typeof result === "object") {
      return result;
    }
    return result();
  }

  init() {
    this.emit(this.initStart);

    return Promise.all(
      this.dirs.map(async ([dirPath, regexp]) =>
        utils.findAllFiles(dirPath, regexp)
      )
    ).then((files) => {
      Promise.all(
        files.flat().map(async (filePath) => {
          const module = await this.loadModule(filePath);
          if (module)
            this.emit(
              this.moduleLoaded,
              filePath.replace(this.rootDir, ""),
              module
            );
        })
      ).then(() => this.emit(this.initFinish, this));
    });
  }
}
