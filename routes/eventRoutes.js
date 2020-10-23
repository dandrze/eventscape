const express = require("express");
const mongoose = require("mongoose");

const Event = mongoose.model("events");
const router = express.Router();

router.post("/api/events", async (req, res) => {
	const {
		title,
		link,
		category,
		startDate,
		endDate,
		timeZone,
		primaryColor,
		regPageModel,
		eventPageModel,
	} = req.body;

	const existingEvent = await Event.findOne({ user: "tester" });

	if (existingEvent) {
		existingEvent.overwrite({
			user: "tester",
			title,
			link,
			category,
			startDate,
			endDate,
			timeZone,
			primaryColor,
			regPageModel,
			eventPageModel,
		});

		existingEvent.save();
	} else {
		const newEvents = new Event({
			user: "tester",
			title,
			link,
			category,
			startDate,
			endDate,
			timeZone,
			primaryColor,
			regPageModel,
			eventPageModel,
		});

		newEvents.save();
	}

	res.status(200).send();
});

router.get("/api/events", async (req, res) => {
	const events = await Event.find({ user: "tester" });

	console.log("api called");

	res.send(events);
});

module.exports = router;
