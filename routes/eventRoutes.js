const express = require("express");
const router = express.Router();

const db = require("../db");

router.post("/api/events/current", async (req, res) => {
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

	// hard coded userId. Will eventualy pull from request params.
	const userId = 1;

	/*
	await db.query(
		"INSERT INTO event (title, link, category, start_date, end_date, time_zone, primary_color) VALUES ($1, $2, $3, $4, $5, $6, $7)",
		[title, link, category, startDate, endDate, timeZone, primaryColor],
		(error, results) => {
			if (error) {
				throw res.status(500).send(error);
			}

			res.status(200).send();
		}
	);
	*/

	const existingEvent = await db.query(
		"SELECT * FROM event WHERE user_id=$1 AND is_current=TRUE",
		[userId],
		(err, res) => {
			if (err) {
				throw res.status(500).send(err);
			}
		}
	);

	console.log(existingEvent);

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
});

router.get("/api/events", async (req, res) => {
	const userId = 1;
	const events = await db.query(
		"SELECT * FROM event WHERE user_id=$1",
		[userId],
		(err, res) => {
			if (err) {
				throw res.status(500).send(err);
			}
		}
	);

	res.send(events.rows);
});

router.get("/api/page", async (req, res) => {
	const link = req.query.link;
	console.log(link);

	const event = await Event.findOne({ link: link });

	console.log(event);

	res.send(event);
});

module.exports = router;
