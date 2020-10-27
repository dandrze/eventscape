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
	app.get("*", checkSubDomain, (req, res) => {
		res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
	});
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log("listening on port " + PORT);
});
