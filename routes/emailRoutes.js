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
  const { recipients, status, from, subject, minutesFromEvent } = email;

  console.log(from);

  const newEmail = await db.query(
    "INSERT INTO email (event, from_name, recipients, status, subject, minutes_from_event) VALUES ($1,$2,$3,$4,$5, $6) RETURNING *",
    [event, from, recipients, status, subject, minutesFromEvent],
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

module.exports = router;
