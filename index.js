const express = require("express");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/authRoutes");

const app = express();

// middleware to catch subdomain
const checkSubDomain = (req, res, next) => {
	if (!req.subdomains.length || req.subdomains.slice(-1)[0] === "www")
		return next();
	// otherwise we have subdomain here
	var subdomain = req.subdomains.slice(-1)[0];
	// keep it
	req.subdomain = subdomain;
	console.log(subdomain);
	next();
};

// routes
app.use(bodyParser.json());
app.use(authRoutes);

if (process.env.NODE_ENV == "production") {
	// if we don't recognize the route, look into the client/build folder
	// will catch things like main.js and main.css
	app.use(express.static("client/build"));

	// if there is no route in the client/build folder then:
	// if we don't regonize the route, serve the html document
	const path = require("path");
	app.get("*", checkSubDomain, (req, res) => {
		// no subdomain
		if (!req.subdomain) {
			// render home page
			res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
		} else {
			res.send(req.subdomain);
		}
	});
}

const PORT = process.env.PORT || 5000;
app.listen(PORT);
