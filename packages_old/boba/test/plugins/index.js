function server() {
  const router = new Map([
    ["GET", new Map()],
    ["POST", new Map()],
    ["PUT", new Map()],
    ["PATH", new Map()],
    ["DELETe", new Map()],
  ]);

  /**
   * @type {import('http')}
   */
  const http = node.http;

  const server = http.createServer(async (req, res) => {
    const { method, url } = req;

    const handler = router.get(method).get(url);

    if (!handler) {
      return res.writeHead(404).end("Not found");
    }

    const result = await handler(req, res);
    if (res.headersSent) return;

    if (!result) return res.writeHead(204).end();
    if (typeof result === "object") {
      return res
        .writeHead(200, { "Content-Type": "application/json" })
        .end(JSON.stringify(result));
    }
  });

  return {
    listen: (...args) => server.listen(...args),
    addRoute: ({ method = "GET", url, handler }) =>
      router.get(method).set(url, handler),
  };
}
