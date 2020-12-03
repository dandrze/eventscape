const express = require("express");
const router = express.Router();

const db = require("../db");

router.post("/api/register", async (req, res) => {
	const {
		firstName,
		lastName,
		email,
		event,
	} = req.body;

	// hard coded userId. Will eventualy pull from request params.
	const userId = 1;

	// Add the registered user
	const res = await db.query(
		`INSERT INTO registration 
				(first_name, last_name, email, event)
			VALUES ($1, $2, $3, 44)
			RETURNING *`,
		[firstName, lastName, email, event],
		(err, res) => {
			if (err) {
				throw res.status(500).send(Error);
			}
		}
	);
	
	res.status(201).send(res.rows[0]);
});


module.exports = router;
