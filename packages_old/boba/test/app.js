function app() {
  console.dir({ server });
  server.listen(3000);
  server.addRoute({
    url: "/",
    handler: async (req, res) => {
      return Promise.resolve({
        name: "Ll1r1k1337",
      });
    },
  });
}
