const express = require("express");
const router = express.Router();
const md5 = require("md5");

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
    subject,
    minutesFromEvent,
    html,
    emailList,
  } = email;

  const newEmail = await db.query(
    "INSERT INTO email (event, recipients, status, subject, minutes_from_event, html) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
    [event, recipients, status, subject, minutesFromEvent, html],
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
      { subject, html, recipients },
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
  const { recipients, status, subject, minutesFromEvent, html } = email;

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
    "UPDATE email SET recipients=$2, status=$3, subject=$4, minutes_from_event=$5, html=$6 WHERE id=$1 RETURNING *",
    [id, recipients, status, subject, minutesFromEvent, html],
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
      { subject, html, recipients },
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

router.post("/api/email/jobs/cancel", async (req, res) => {
  const { id } = req.body;

  Scheduler.cancelSend(id);
});

router.get("/api/email-list", async (req, res) => {
  const { emailId } = req.query;

  const emailList = await db.query(
    "SELECT * FROM recipient WHERE email_template_id=$1",
    [emailId],
    (err, res) => {
      if (err) {
        throw res.status(500).send(err);
      }
    }
  );

  res.status(200).send(emailList.rows);
});

router.post("/api/email-list", async (req, res) => {
  const { data, emailId } = req.body;

  const { first_name, last_name, email } = data;

  const newRecipient = await db.query(
    "INSERT INTO recipient (first_name, last_name, email, email_template_id) VALUES ($1, $2, $3, $4) returning id",
    [first_name, last_name, email, emailId]
  );

  const addHash = await db.query("UPDATE recipient SET hash=$1 WHERE id=$2", [
    md5(newRecipient.rows[0].id),
    newRecipient.rows[0].id,
  ]);

  res.status(200).send(newRecipient.rows);
});

router.put("/api/email-list", async (req, res) => {
  const { data, id } = req.body;

  console.log(data);

  const { first_name, last_name, email } = data;

  const emailList = await db.query(
    "UPDATE recipient SET first_name=$1, last_name=$2, email=$3 WHERE id=$4",
    [first_name, last_name, email, id],
    (err, res) => {
      if (err) {
        throw res.status(500).send(err);
      }
    }
  );

  res.status(200).send(emailList.rows[0]);
});

router.delete("/api/email-list", async (req, res) => {
  const { id } = req.query;

  const response = await db.query(
    "DELETE FROM recipient WHERE id=$1",
    [id],
    (err, res) => {
      if (err) {
        throw res.status(500).send(err);
      }
    }
  );

  res.status(200).send(response.rows);
});

// HELPER FUNCTIONS

const scheduleJob = async (jobName, email, eventId, minutesFromEvent) => {
  const { subject, html, recipients } = email;

  const event = await getEventFromId(eventId);

  const sendDate = new Date(event.start_date);

  sendDate.setMinutes(sendDate.getMinutes() + minutesFromEvent);

  Scheduler.scheduleSend(
    jobName,
    { to: "andrzejewski.d@gmail.com", subject, html, recipients },
    sendDate,
    eventId
  );
};

module.exports = router;
