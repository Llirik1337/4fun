() => {
  const routers = {};

  /**
   * @type {import('http')}
   */
  const http = node.http;

  const serverInstance = http.createServer(async (req, res) => {
    const { method, url } = req;
    const handler = routers[`${method}|${url}`];
    console.info({ method, url, handler });

    if (!handler) {
      return res.writeHead(404).end(http.STATUS_CODES[404]);
    }

    try {
      const result = await handler(req, res);
      if (res.headersSent) return;
      if (!result) {
        return res.writeHead(204).end(http.STATUS_CODES[204]);
      }

      return res
        .writeHead(200, { "Content-Type": "application/json" })
        .end(JSON.stringify(result));
    } catch (error) {
      if (res.headersSent) return;
      return res.writeHead(500).end(http.STATUS_CODES[500]);
    }
  });

  return {
    add: ({ method = "GET", url, handler }) => {
      routers[`${method}|${url}`] = handler;
    },
    listen: (port) => {
      serverInstance.listen(port);
    },
  };
};
