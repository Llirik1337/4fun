import { readFile } from "fs/promises";
import { createContext, Script } from "vm";
export const loadScript = async (filename) =>
  new Script(await readFile(filename, "utf-8"), {
    filename: filename,
  });

const nodeModules = ["os", "path", "http", "http2", "https"];

const getNpmModules = async () =>
  Object.keys(
    JSON.parse(await readFile("package.json", "utf-8")).dependencies || {}
  );

const loadModules = async (names = []) => {
  const modules = {};

  await Promise.all(
    names.map(async (name) => {
      modules[name] = await import(name);
    })
  );
  return modules;
};

export const createApp = async () => {
  let countAnon = 0;

  /**
   * @type {{script: Script, filename: string}[]}
   */
  const scripts = [];

  const npmModules = await getNpmModules();

  const [npm, node] = await Promise.all([
    loadModules(npmModules),
    loadModules(nodeModules),
  ]);

  const scope = {};

  const getContext = () =>
    createContext(
      Object.freeze({
        node: Object.freeze(node),
        npm: Object.freeze(npm),
        Math,
        Buffer,
        console,
        process,
        ...scope,
      })
    );

  const app = {
    register: ({ filename = `anon-${countAnon++}`, script }) =>
      scripts.push({ filename, script }),
    init: async () => {
      for (const { filename, script } of scripts) {
        console.info({ filename, script });
        const initScript = script.runInContext(getContext(), {
          microtaskMode: "afterEvaluate",
        });

        if (typeof initScript === "function") {
          const result = await initScript();
          console.dir(Object.assign({}, result));
          scope[filename] = scope[filename]
            ? { ...scope[filename], ...result }
            : result;
        }
      }
    },
  };
  return new Proxy(app, {
    get(t, p, r) {
      if (typeof p === "string" && Object.keys(t).includes(p)) {
        return Reflect.get(t, p, r);
      }
      return Reflect.get(scope, p, scope);
    },
  });
};
