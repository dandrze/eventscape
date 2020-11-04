const express = require("express");
const mongoose = require("mongoose");

const Event = mongoose.model("events");
const router = express.Router();

router.post("/api/event", async (req, res) => {
	const {
		title,
		link,
		category,
		startDate,
		endDate,
		timeZone,
		primaryColor,
		savedPageModel,
		livePageModel,
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
			savedPageModel,
			livePageModel,
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
			savedPageModel,
			livePageModel,
		});

		newEvents.save();
	}

	res.status(200).send();
});

router.get("/api/event", async (req, res) => {
	const event = await Event.findOne({ user: "tester" });

	console.log("api called");

	res.send(event);
});

router.get("/api/page", async (req, res) => {
	const link = req.query.link;
	console.log(link);

	const event = await Event.findOne({ link: link });

	console.log(event);

	res.send(event);
});

module.exports = router;
