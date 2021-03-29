const express = require("express");
const router = express.Router();
const md5 = require("md5");

const Scheduler = require("../services/Scheduler");
const { recipientsOptions, statusOptions } = require("../model/enums");
const Mailer = require("../services/Mailer");
const { Communication, EmailListRecipient, Event } = require("../db").models;
const Registration = require("../db/models/Registration");

router.get("/api/communication/all", async (req, res, next) => {
  const { EventId } = req.query;

  try {
    const communications = await Communication.findAll({
      where: { EventId },
    });

    res.send(communications);
  } catch (error) {
    next(error);
  }
});

router.post("/api/communication", async (req, res, next) => {
  const { EventId, email } = req.body;
  const {
    recipients,
    status,
    subject,
    minutesFromEvent,
    html,
    emailList,
  } = email;

  try {
    const communication = await Communication.create({
      EventId,
      recipients,
      status,
      subject,
      minutesFromEvent,
      html,
    });

    if (
      status === statusOptions.ACTIVE &&
      recipients != recipientsOptions.NEW_REGISTRANTS
    ) {
      const to = [];

      const event = await Event.findByPk(EventId);

      scheduleJob(
        communication.id,
        { subject, html, recipients },
        event,
        minutesFromEvent
      );
    }

    res.send(communication);
  } catch (error) {
    next(error);
  }
});

router.delete("/api/communication", async (req, res, next) => {
  const { id } = req.query;
  try {
    const response = await Communication.destroy({ where: { id } });

    res.json({ response });
  } catch (error) {
    next(error);
  }
});

router.put("/api/communication", async (req, res, next) => {
  const { id, email } = req.body;
  const { recipients, status, subject, minutesFromEvent, html } = email;

  try {
    const communication = await Communication.findByPk(id);

    if (status === "Active" && recipients != "New Registrants") {
      // delete the old job because it could have stale data
      Scheduler.cancelSend(id.toString());
      // create a new job with fresh data

      const event = await Event.findByPk(communication.EventId);

      scheduleJob(
        id.toString(),
        { subject, html, recipients },
        event,
        minutesFromEvent
      );
    } else if (
      communication.status === "Active" ||
      communication.recipients != "New Registrants"
    ) {
      // if either of these two conditions is true, then there might be an existing job we need to cancel
      Scheduler.cancelSend(id.toString());
    }

    communication.recipients = recipients;
    communication.status = status;
    communication.subject = subject;
    communication.minutesFromEvent = minutesFromEvent;
    communication.html = html;

    await communication.save();

    res.send(communication);
  } catch (error) {
    next(error);
  }
});

router.get("/api/communication/jobs", async (req, res) => {
  res.send(Scheduler.scheduledJobs());
});

router.post("/api/communication/jobs/cancel", async (req, res) => {
  const { id } = req.body;

  Scheduler.cancelSend(id);
});

router.get("/api/communication-list", async (req, res, next) => {
  const { emailId } = req.query;

  try {
    const emailListRecipients = await EmailListRecipient.findAll({
      where: { CommunicationId: emailId },
    });

    res.json(emailListRecipients);
  } catch (error) {
    next(error);
  }
});

router.post("/api/communication-list", async (req, res, next) => {
  const { data, emailId } = req.body;

  const { firstName, lastName, email } = data;

  try {
    const emailListRecipient = await EmailListRecipient.create({
      firstName,
      lastName,
      email,
      CommunicationId: emailId,
    });

    emailListRecipient.hash = md5(emailListRecipient.id);

    await emailListRecipient.save();

    res.json(emailListRecipient);
  } catch (error) {
    next(error);
  }
});

router.put("/api/communication-list", async (req, res, next) => {
  const { data, id } = req.body;

  const { firstName, lastName, email } = data;

  try {
    const emailListRecipient = await EmailListRecipient.findByPk(id);

    emailListRecipient.firstName = firstName;
    emailListRecipient.lastName = lastName;
    emailListRecipient.email = email;
    await emailListRecipient.save();

    res.json(emailListRecipient);
  } catch (error) {
    next(error);
  }
});

router.delete("/api/communication-list", async (req, res, next) => {
  const { id } = req.query;

  try {
    const emailListRecipient = await EmailListRecipient.findByPk(id);
    const response = await emailListRecipient.destroy();

    res.json({ response });
  } catch (error) {
    next(error);
  }
});

router.post("/api/communication/test", async (req, res, next) => {
  const {
    EventId,
    email: { emailAddress, firstName, lastName, subject, html },
  } = req.body;

  testRecipient = {
    firstName,
    lastName,
    emailAddress,
    hash: md5("tester"),
  };

  // pull all relevant data to map to variables and put them into a list
  const event = await Event.findByPk(EventId, { raw: true });
  const recipientData = { ...testRecipient, Event: event };

  try {
    const { success, failed } = await Mailer.mapVariablesAndSendEmail(
      [recipientData],
      subject,
      html
    );

    if (success) {
      res.json();
    } else {
      res.status(400).send();
    }
  } catch (error) {
    next(error);
  }
});

// HELPER FUNCTIONS

const scheduleJob = async (jobName, email, event, minutesFromEvent) => {
  const { subject, html, recipients } = email;

  const sendDate = new Date(event.startDate);

  sendDate.setMinutes(sendDate.getMinutes() + minutesFromEvent);

  Scheduler.scheduleSend(
    jobName,
    { to: "andrzejewski.d@gmail.com", subject, html, recipients },
    sendDate,
    event.id
  );
};

module.exports = router;
