const express = require("express");
const router = express.Router();

const db = require("../db");

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
		regPageLive,
		eventPageLive,
	} = req.body;

	// hard coded userId. Will eventualy pull from request params.
	const userId = 1;

	// set all other events is_current to false so we can make our new event current
	await db.query(
		`UPDATE event 
		SET is_current = false
		WHERE user_id = $1`,
		[userId],
		(err, res) => {
			if (err) {
				throw res.status(500).send(err);
			}
		}
	);

	// Store a new model in the model table for the registration page
	const pgRegModel = await db.query(
		`INSERT INTO model 
				(type)
			VALUES ($1)
			RETURNING id`,
		["model"],
		(err, res) => {
			if (err) {
				throw res.status(500).send(Error);
			}
		}
	);

	// Store the section HTML for the model above
	for (i = 0; i < regPageModel.length; i++) {
		await db.query(
			`INSERT INTO section_html
					(model, index, html)
					VALUES
					($1, $2, $3)`,
			[pgRegModel.rows[0].id, i, regPageModel[i].sectionHtml]
		);
	}

	// Store a new model in the model table for the event page
	const pgEventModel = await db.query(
		`INSERT INTO model 
				(type)
			VALUES ($1)
			RETURNING id`,
		["model"],
		(err, res) => {
			if (err) {
				throw res.status(500).send(Error);
			}
		}
	);

	// Store the section HTML for the model above
	for (i = 0; i < eventPageModel.length; i++) {
		await db.query(
			`INSERT INTO section_html
					(model, index, html)
					VALUES
					($1, $2, $3)`,
			[pgEventModel.rows[0].id, i, eventPageModel[i].sectionHtml]
		);
	}

	// add the event to the event table. Make it the current event
	const newEvent = await db.query(
		`INSERT INTO event 
			(title, link, category, start_date, end_date, time_zone, primary_color, is_current, user_id, reg_page_is_live, event_page_is_live, reg_page_model, event_page_model) 
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
		RETURNING *`,
		[
			title,
			link,
			category,
			startDate,
			endDate,
			timeZone,
			primaryColor,
			true,
			userId,
			regPageLive,
			eventPageLive,
			pgRegModel.rows[0].id,
			pgEventModel.rows[0].id,
		],
		(err, res) => {
			if (err) {
				throw res.status(500).send(Error);
			}
		}
	);

	res.status(200).send(newEvent.rows[0]);
});

router.get("/api/events/current", async (req, res) => {
	const userId = 1;
	const events = await db.query(
		"SELECT * FROM event WHERE user_id=$1 AND is_current=true",
		[userId],
		(err, res) => {
			if (err) {
				throw res.status(500).send(err);
			}
		}
	);

	res.send(events.rows[0]);
});

module.exports = router;
