const express = require("express");
const router = express.Router();

const db = require("../db");

router.post("/api/registration", async (req, res) => {
  const { firstName, lastName, email, event, organization } = req.body;

  // hard coded userId. Will eventualy pull from request params.
  const userId = 1;

  // Add the registered user
  const newRegistration = await db.query(
    `INSERT INTO registration 
				(first_name, last_name, email, event, organization)
			VALUES ($1, $2, $3, $4, $5)
			RETURNING *`,
    [firstName, lastName, email, event, organization],
    (err, res) => {
      if (err) {
        throw res.status(500).send(Error);
      }
    }
  );

  res.status(201).send(newRegistration.rows[0]);
});

router.get("/api/registration", async (req, res) => {
  const { event } = req.query;

  // hard coded userId. Will eventualy pull from request params.
  const userId = 1;

  // Get list of all registrations for this event
  const registrations = await db.query(
    `SELECT * 
		FROM 
			registration
		WHERE 
			event=$1`,
    [event],
    (err, res) => {
      if (err) {
        throw res.status(500).send(Error);
      }
    }
  );

  console.log(registrations);

  res.status(201).send(registrations.rows[0]);
});

module.exports = router;
