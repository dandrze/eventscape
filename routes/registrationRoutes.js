const express = require("express");
const router = express.Router();

const db = require("../db");

router.post("/api/registration", async (req, res) => {
  const { firstName, lastName, email, event, organization } = req.body;

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

  res.status(200).send(newRegistration.rows[0]);
});

router.put("/api/registration", async (req, res) => {
  const { firstName, lastName, email, event, organization, id } = req.body;

  // Add the registered user
  const newRegistration = await db.query(
    `UPDATE registration 
    SET 
      first_name = $1, 
      last_name = $2, 
      email = $3, 
      organization = $4
    WHERE
      id = $5
		RETURNING id`,
    [firstName, lastName, email, organization, id],
    (err, res) => {
      if (err) {
        throw res.status(500).send(Error);
      }
    }
  );

  res.status(200).send(newRegistration.rows[0]);
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
      event=$1
    ORDER BY
      id`,
    [event],
    (err, res) => {
      if (err) {
        throw res.status(500).send(Error);
      }
    }
  );

  res.status(200).send(registrations.rows);
});

router.delete("/api/registration/id", async (req, res) => {
  const { id } = req.query;
  const response = await db.query(
    "DELETE FROM registration WHERE id=$1",
    [id],
    (err, res) => {
      if (err) {
        throw res.status(500).send(err);
      }
    }
  );

  res.send(response);
});

module.exports = router;
