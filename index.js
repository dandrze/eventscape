const express = require("express");
const bodyParser = require("body-parser");
const passport = require("passport");
const secure = require("express-force-https");
const { Client } = require("pg");

require("./models/Event.js");

const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");

//console.log(process.env.DATABASE_URL);

// Connect to Postgres
const client = new Client({
	connectionString: process.env.DATABASE_URL,
	ssl: {
		rejectUnauthorized: false,
	},
});

client.connect();

const app = express();
const router = express.Router();

// Force HTTPS
app.use(secure);

// routes
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());
app.use(authRoutes);
app.use(eventRoutes);

app.get("/loaderio-770148bdcbe788892fafba4a049219a4/", async (req, res) => {
	file = `${__dirname}/public/loaderio-770148bdcbe788892fafba4a049219a4.txt`;

	res.download(file);
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
/*app.listen(PORT, () => {
	console.log("listening on port " + PORT);
});*/
