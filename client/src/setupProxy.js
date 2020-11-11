const { createProxyMiddleware } = require("http-proxy-middleware");
module.exports = function (app) {
	app.use(
		["/api", "/api/event", "/api/model"],
		createProxyMiddleware({
			target: "http://localhost:5000",
		})
	);
};
