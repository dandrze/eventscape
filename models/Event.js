const mongoose = require("mongoose");
const modelSchema = require("./Model");

const eventSchema = new mongoose.Schema({
	user: String,
	title: String,
	link: String,
	category: String,
	startDate: String,
	endDate: String,
	timeZone: String,
	primaryColor: String,
	savedPageModel: {
		eventPageModel: [modelSchema],
		regPageModel: [modelSchema],
	},
	livePageModel: {
		eventPageModel: [modelSchema],
		regPageModel: [modelSchema],
	},
});

mongoose.model("events", eventSchema);
