import { createApp, loadScript, plugins } from "@4fun/biba2";
import { readdir } from "fs/promises";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = await createApp();

plugins.httpServer(app);

app.register({
  filename: "config",
  script: await loadScript(join(__dirname, "config.js")),
});

const entitiesPath = join(__dirname, "entities");
const entities = await readdir(entitiesPath);

await Promise.all(
  entities.map(async (file) =>
    app.register({
      filename: "entities",
      script: await loadScript(join(entitiesPath, file)),
    })
  )
);

app.register({ script: await loadScript(join(__dirname, "main.js")) });

await app.init();
