httpServer.add({
  url: "/",
  handler: (req, res) => {
    res.writeHead(200).end();
  },
});
httpServer.listen(3000);
