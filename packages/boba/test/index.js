import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { initApp } from "../src/index.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

await initApp([join(__dirname, "plugins"), join(__dirname, "app.js")]);
