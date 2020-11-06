const express = require("express");
const bodyParser = require("body-parser");
const passport = require("passport");
const secure = require("express-force-https");

require("./models/Event.js");
const db = require("./db");

const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");

//console.log(process.env.DATABASE_URL);

const app = express();
const router = express.Router();

const test = async () => {
	db.query("SELECT * FROM event", (err, res) => {
		if (err) {
			throw res.status(500).send(err);
		}
		//console.log(res);
		//res.status(200).send(res);
	});

	const result = await db.query("SELECT * FROM event");

	console.log(result.rows);
};

test();

// Force HTTPS
app.use(secure);

// routes
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());
app.use(authRoutes);
app.use(eventRoutes);

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

/*
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log("listening on port " + PORT);
});
*/
