const express = require("express");
const router = express.Router();

const db = require("../db");

router.post("/api/event", async (req, res) => {
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
			[pgRegModel.rows[0].id, i, regPageModel[i].html]
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
			[pgEventModel.rows[0].id, i, eventPageModel[i].html]
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

	res.status(201).send(newEvent.rows[0]);
});

router.get("/api/event/current", async (req, res) => {
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

router.get("/api/event/all", async (req, res) => {
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

router.put("/api/event", async (req, res) => {
	const userId = 1;

	const {
		title,
		link,
		category,
		startDate,
		endDate,
		timeZone,
		primaryColor,
		regPageIsLive,
		eventPageIsLive,
	} = req.body;

	const events = await db.query(
		`UPDATE event 
		SET 
		  title = $1, 
		  link = $2, 
		  category = $3,
		  start_date = $4,
		  end_date = $5, 
		  time_zone = $6,
		  primary_color = $7,
		  reg_page_is_live = $8,
		  event_page_is_live = $9
		WHERE 
		  user_id=$10 AND is_current=true
		RETURNING *`,
		[
			title,
			link,
			category,
			startDate,
			endDate,
			timeZone,
			primaryColor,
			regPageIsLive,
			eventPageIsLive,
			userId,
		],
		(err, res) => {
			if (err) {
				throw res.status(500).send(err);
			}
		}
	);

	res.send(events.rows[0]);
});

module.exports = router;
