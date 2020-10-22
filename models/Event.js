const mongoose = require("mongoose");
const modelSchema = require("./Model");

const eventSchema = new mongoose.Schema({
	title: String,
	link: String,
	category: String,
	startDate: String,
	endDate: String,
	timeZone: String,
	primaryColor: String,
	eventPageModel: modelSchema,
	regPageModel: modelSchema,
});

mongoose.model("events", eventSchema);
