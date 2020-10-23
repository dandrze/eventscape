const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");

require("./models/Event.js");

const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");

// mongoDB
const mongoUri =
	"mongodb+srv://admin:Shaw2020@cluster0.9wjqj.mongodb.net/dev?retryWrites=true&w=majority";
mongoose.connect(mongoUri, {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true,
});
mongoose.connection.on("connected", () => {
	console.log("connected to mongo instance");
});

mongoose.connection.on("error", (err) => {
	console.error("Error connecting to mongo", err);
});

const app = express();
const router = express.Router();

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
<<<<<<< HEAD
//app.use(authRoutes);

app.get("/", (req, res) => {
	var domain = req.get("host").match(/\w+/);

	console.log(domain);
	res.send("hello");

	/*if (domain)
       var subdomain = domain[0]; // Use "subdomain"
    */
});
=======
app.use(passport.initialize());
app.use(passport.session());
app.use(authRoutes);
app.use(eventRoutes);
>>>>>>> subdomain

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
			// there is a subdomain, so point to the event page
			res.send(req.subdomain);
		}
	});
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log("listening on port " + PORT);
});
