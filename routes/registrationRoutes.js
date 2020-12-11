const express = require("express");
const router = express.Router();

const db = require("../db");

router.post("/api/registration", async (req, res) => {
  console.log(req.body);

  const { event, values } = req.body;

  // Add the registered user
  const newRegistration = await db.query(
    `INSERT INTO registration 
				(event, values)
			VALUES ($1, $2)
			RETURNING *`,
    [event, JSON.stringify(values)],
    (err, res) => {
      if (err) {
        throw res.status(500).send(Error);
      }
    }
  );
  if (newRegistration.rows) res.status(200).send(newRegistration.rows[0]);
});

router.put("/api/registration", async (req, res) => {
  const { id, values } = req.body;

  // Add the registered user
  const newRegistration = await db.query(
    `UPDATE registration 
    SET 
      values = $1
    WHERE
      id = $2
		RETURNING *`,
    [values, id],
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

router.post("/api/form", async (req, res) => {
  const { event, data } = req.body;

  console.log(req.body);

  const existingForm = await db.query(
    "SELECT * FROM registration_form WHERE event=$1",
    [event]
  );

  console.log(existingForm);

  if (existingForm.rowCount == 0) {
    const entry = await db.query(
      "INSERT INTO registration_form (event, data) VALUES ($1,$2)",
      [event, JSON.stringify(data)],
      (err, res) => {
        if (err) {
          throw res.status(500).send(err);
        }
      }
    );
  } else {
    const entry = await db.query(
      "UPDATE registration_form SET data=$2 WHERE event=$1",
      [event, JSON.stringify(data)],
      (err, res) => {
        if (err) {
          throw res.status(500).send(err);
        }
      }
    );
  }

  res.status(200).send();
});

router.get("/api/form", async (req, res) => {
  const { event } = req.query;

  console.log(req);

  const data = await db.query(
    "SELECT data FROM registration_form WHERE event=$1",
    [event],
    (err, res) => {
      if (err) {
        throw res.status(500).send(err);
      }
    }
  );

  if (data.rowCount != 0) {
    res.status(200).send(data.rows[0].data);
  } else {
    res.status(204).send([]);
  }
});

module.exports = router;
