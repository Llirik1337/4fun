import { basename, dirname, join } from "path";
import { cwd } from "process";
import { fileURLToPath } from "url";
import { Application } from "../src/index.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

const controllers = join(__dirname, "api").replace(join(cwd(), "/"), "");
const plugins = join(__dirname, "plugins").replace(join(cwd(), "/"), "");
const app = new Application({
  rootDir: basename(__dirname) + "/",
  dirs: [
    [plugins, /\.js$/],
    [controllers, /\.js$/],
  ],
});

await app.init();
