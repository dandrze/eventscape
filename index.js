const express = require("express");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/authRoutes");

const app = express();
const router = express.Router();

// routes
app.use(bodyParser.json());
//app.use(authRoutes);

app.get("/", (req, res) => {
	var domain = req.get("host").match(/\w+/);

	console.log(domain);
	res.send("hello");

	/*if (domain)
       var subdomain = domain[0]; // Use "subdomain"
    */
});

if (process.env.NODE_ENV == "production") {
	// if we don't recognize the route, look into the client/build folder
	// will catch things like main.js and main.css
	app.use(express.static("client/build"));

	// if there is no route in the client/build folder then:
	// if we don't regonize the route, serve the html document
	const path = require("path");
	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
	});
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log("listening on port " + PORT);
});
