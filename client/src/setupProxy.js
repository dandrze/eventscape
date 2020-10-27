const { createProxyMiddleware } = require("http-proxy-middleware");
module.exports = function (app) {
	app.use(
		["/api", "/api/event"],
		createProxyMiddleware({
			target: "http://localhost:5000",
		})
	);
};
