const express = require("express");
const router = express.Router();

const db = require("../db");

router.get("/api/email/all", async (req, res) => {
  const { event } = req.query;

  const emails = await db.query(
    "SELECT * FROM email WHERE event=$1",
    [event],
    (err, res) => {
      if (err) {
        throw res.status(500).send(err);
      }
    }
  );

  res.send(emails.rows);
});

router.post("/api/email", async (req, res) => {
  const { event, email } = req.body;
  const { recipients, status, from, subject, minutesFromEvent, html } = email;

  console.log(from);

  const newEmail = await db.query(
    "INSERT INTO email (event, from_name, recipients, status, subject, minutes_from_event, html) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
    [event, from, recipients, status, subject, minutesFromEvent, html],
    (err, res) => {
      if (err) {
        console.log(err);
        throw res.status(500).send(err);
      }
    }
  );

  res.send(newEmail.rows[0]);
});

router.delete("/api/email", async (req, res) => {
  const { id } = req.query;
  const response = await db.query(
    "DELETE FROM email WHERE id=$1",
    [id],
    (err, res) => {
      if (err) {
        throw res.status(500).send(err);
      }
    }
  );

  res.send(response);
});

router.put("/api/email", async (req, res) => {
  const { id, email } = req.body;
  const { recipients, status, from, subject, minutesFromEvent, html } = email;

  console.log(from);

  const newEmail = await db.query(
    "UPDATE email SET from_name=$2, recipients=$3, status=$4, subject=$5, minutes_from_event=$6, html=$7 WHERE id=$1 RETURNING *",
    [id, from, recipients, status, subject, minutesFromEvent, html],
    (err, res) => {
      if (err) {
        console.log(err);
        throw res.status(500).send(err);
      }
    }
  );

  res.send(newEmail.rows[0]);
});

module.exports = router;
