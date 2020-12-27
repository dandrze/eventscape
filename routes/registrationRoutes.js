const express = require("express");
const router = express.Router();
const { recipientsOptions } = require("../model/enums");
const Mailer = require("../services/Mailer");

const db = require("../db");
const { PromiseProvider } = require("mongoose");

router.post("/api/registration", async (req, res) => {
  const { event, values, emailAddress, firstName, lastName } = req.body;

  // Add the registered user
  const newRegistration = await db.query(
    `INSERT INTO registration 
				(event, values, email, first_name, last_name)
			VALUES ($1, $2, $3, $4, $5)
			RETURNING *`,
    [event, JSON.stringify(values), emailAddress, firstName, lastName],
    (err, res) => {
      if (err) {
        res.status(500).json({ message: "Error when saving to database" });
        return;
      }
    }
  );

  // check to see if any emails need to be fired off
  const registrationEmails = await db.query(
    `SELECT * FROM email WHERE event=$1 AND recipients=$2`,
    [event, recipientsOptions.NEW_REGISTRANTS],
    (err, res) => {
      if (err) {
        res.status(500).json({ message: "Error when sending email" });
        return;
      }
    }
  );

  console.log(registrationEmails.rows);

  for (var email of registrationEmails.rows) {
    try {
      const response = await Mailer.sendEmail({
        to: "andrzejewski.d@gmail.com",
        subject: email.subject,
        html: email.html,
      });
    } catch (error) {
      res.status(500).json({ message: "Error when sending email." });
      return;
    }
  }

  //if no errors were triggered and sent (res.status.(500).send()) then everything worked and send the new regsitration
  res.status(200).send(newRegistration.rows[0]);
});

router.put("/api/registration", async (req, res) => {
  const { id, values, emailAddress, firstName, lastName } = req.body;

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

  const userId = req.user.id;

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

  const existingForm = await db.query(
    "SELECT * FROM registration_form WHERE event=$1",
    [event]
  );

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
