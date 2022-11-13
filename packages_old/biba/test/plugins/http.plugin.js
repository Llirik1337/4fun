() => {
  const router = new Map([
    ["GET", new Map()],
    ["POST", new Map()],
    ["PUT", new Map()],
    ["PATH", new Map()],
  ]);

  /**
   * @type {import('http')}
   */
  const http = node.http;

  http
    .createServer(async (req, res) => {
      const { url, method } = req;
      const handler = router.get(method)?.get(url);
      if (!handler) {
        return res.writeHead(404).end();
      }
      const result = await handler();

      res.writeHead(result ? 200 : 204).end(JSON.stringify(result));
    })
    .listen(8080);

  console.log("Server start on 8080");

  setTimeout(() => console.dir({ router }), 1000);
  /**
   * @type {import('path')}
   */
  const path = node.path;
  app.on(
    app.moduleLoaded,
    /**
     *
     * @param {string} pathToFile
     * @param {*} module
     * @returns
     */
    (pathToFile, module) => {
      const { handler } = module;

      if (!pathToFile.startsWith("api")) return;

      const url = pathToFile.replace(/\.js$/, "").replace("api/", "");

      const [method, name] = path.basename(url).split(".");
      router
        .get(method.toUpperCase())
        .set(`/${url.replace(path.basename(url), "")}${name}`, handler);
    }
  );
};
