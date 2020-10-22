const { createProxyMiddleware } = require("http-proxy-middleware");
module.exports = function (app) {
	app.use(
		["/api", "/api/events"],
		createProxyMiddleware({
			target: "http://localhost:5000",
		})
	);
};
