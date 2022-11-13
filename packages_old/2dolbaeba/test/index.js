import { createApplication, plugins } from "../src/index.js";

export const app = createApplication();

const config = () => ({
  port: 3000,
});

app.register(config);
app.register(plugins.logger);
app.register(plugins.httpServer);

app.httpServer.listen(app.config.port);

app.httpServer.add("GET", "/", (req, res) => {
  return { name: "Lll1r1k1337" };
});
