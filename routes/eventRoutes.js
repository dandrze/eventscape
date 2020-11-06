const express = require("express");
const router = express.Router();

const db = require("../db");

router.post("/api/event/", async (req, res) => {
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

	await db.query(
		`INSERT INTO event VALUES ('$1','$2','$3','$4','$5','$6','$7','$1','$1')`,
		[title, link, category, startDate, endDate, timeZone, primaryColor]
	);

	/*
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
	}*/

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
