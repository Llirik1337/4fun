import { dirname, join, relative } from "path";
import { cwd } from "process";
import { fileURLToPath } from "url";
import { createApp, loadScript, plugins } from "../src/index.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = await createApp();

await plugins.httpServer(app);
const appPath = join(relative(cwd(), __dirname), "app.js");
app.register({ script: await loadScript(appPath) });

await app.init();

app.httpServer.add({
  url: "/test",
  handler: (req, res) => {
    res
      .writeHead(200, { "Content-Type": "application/json" })
      .end(JSON.stringify({ name: "Ll1r1k1337" }));
  },
});
