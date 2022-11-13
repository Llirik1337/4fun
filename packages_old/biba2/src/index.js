import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { loadScript } from "./application.js";

export * from "./application.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

const pluginsPath = join(__dirname, "plugins");

export const plugins = {
  httpServer: async (app) =>
    app.register({
      filename: "httpServer",
      script: await loadScript(join(pluginsPath, "http-server.js")),
    }),
};
