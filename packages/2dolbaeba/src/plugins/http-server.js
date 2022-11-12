import { createServer, STATUS_CODES } from "http";

const generateKey = (...args) => args.join("|");

/**
 * @type {import("../application.js").ModuleType}
 */
export const httpServer = ({ logger }) => {
  const router = {};

  const serverInstance = createServer(async (req, res) => {
    const { method, url } = req;
    logger.debug("request:", { method, url });
    const handler = router[generateKey(method, url)];
    if (!handler) {
      return res.writeHead(404).end(STATUS_CODES[404]);
    }

    const result = await handler(req, res);

    if (res.headersSent) {
      return;
    }
    if (result !== undefined) {
      return res
        .writeHead(200, { "Content-Type": "application/json" })
        .end(JSON.stringify(result));
    }
    return res.writeHead(204).end();
  });

  return {
    listen: (port) => serverInstance.listen(port),
    add: (method, url, handler) => {
      router[generateKey(method, url)] = handler;
    },
    instance: serverInstance,
  };
};
