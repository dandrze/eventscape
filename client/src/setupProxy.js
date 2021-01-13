const { createProxyMiddleware } = require("http-proxy-middleware");
module.exports = function (app) {
  app.use(
    [
      "/api",
      "/api/event",
      "/api/model",
      "/auth",
      "/auth/current-user",
      "/api/socket/chat",
    ],
    createProxyMiddleware({
      target: "http://localhost:5000",
    })
  );
};
