const express = require("express");
const router = express.Router();

const db = require("../db");
const Scheduler = require("../services/Scheduler");
const { getEventFromId } = require("../db/Event");
const { recipientsOptions } = require("../model/enums");

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
  const {
    recipients,
    status,
    replyTo,
    subject,
    minutesFromEvent,
    html,
    emailList,
  } = email;

  const newEmail = await db.query(
    "INSERT INTO email (event, reply_to, recipients, status, subject, minutes_from_event, html) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
    [event, replyTo, recipients, status, subject, minutesFromEvent, html],
    (err, res) => {
      if (err) {
        console.log(err);
        throw res.status(500).send(err);
      }
    }
  );

  if (status === "Active" && recipients != recipientsOptions.NEW_REGISTRANTS) {
    const to = [];

    scheduleJob(
      newEmail.rows[0].id,
      { replyTo, subject, html, replyTo, recipients },
      event,
      minutesFromEvent
    );
  }

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
  const {
    recipients,
    status,
    replyTo,
    subject,
    minutesFromEvent,
    html,
  } = email;

  const originalEmailData = await db.query(
    "SELECT * FROM email WHERE id=$1",
    [id],
    (err, res) => {
      if (err) {
        throw res.status(500).send(err);
      }
    }
  );

  const originalEmail = originalEmailData.rows[0];

  const updatedEmail = await db.query(
    "UPDATE email SET reply_to=$2, recipients=$3, status=$4, subject=$5, minutes_from_event=$6, html=$7 WHERE id=$1 RETURNING *",
    [id, replyTo, recipients, status, subject, minutesFromEvent, html],
    (err, res) => {
      if (err) {
        console.log(err);
        throw res.status(500).send(err);
      }
    }
  );

  if (status === "Active" && recipients != "New Registrants") {
    // delete the old job because it could have stale data
    Scheduler.cancelSend(id.toString());
    // create a new job with fresh data
    scheduleJob(
      id.toString(),
      { replyTo, subject, html, recipients },
      updatedEmail.rows[0].event,
      minutesFromEvent
    );
  } else if (
    originalEmail.status === "Active" ||
    originalEmail.recipients != "New Registrants"
  ) {
    // if either of these two conditions is true, then there might be an existing job we need to cancel
    Scheduler.cancelSend(id.toString());
  }

  res.send(updatedEmail.rows[0]);
});

router.get("/api/email/jobs", async (req, res) => {
  res.send(Scheduler.scheduledJobs());
});

router.post("api/email/jobs/cancel", async (req, res) => {
  const { id } = req.body;

  Scheduler.cancelSend(id);
});

const scheduleJob = async (jobName, email, eventId, minutesFromEvent) => {
  const { replyTo, subject, html, recipients } = email;

  const event = await getEventFromId(eventId);

  const sendDate = new Date(event.start_date);

  sendDate.setMinutes(sendDate.getMinutes() + minutesFromEvent);

  Scheduler.scheduleSend(
    jobName,
    { to: "andrzejewski.d@gmail.com", subject, html, replyTo, recipients },
    sendDate,
    eventId
  );
};

module.exports = router;
