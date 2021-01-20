const express = require("express");
const router = express.Router();
const md5 = require("md5");

const Scheduler = require("../services/Scheduler");
const { recipientsOptions, statusOptions } = require("../model/enums");
const Mailer = require("../services/Mailer");
const { Communication, EmailListRecipient, Event } = require("../db").models;

router.get("/api/communication/all", async (req, res) => {
  const { EventId } = req.query;

  const communications = await Communication.findAll({
    where: { EventId },
  });

  res.send(communications);
});

router.post("/api/communication", async (req, res) => {
  const { event, email } = req.body;
  const {
    recipients,
    status,
    subject,
    minutesFromEvent,
    html,
    emailList,
  } = email;

  const communication = await Communication.create({
    EventId: event,
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

    scheduleJob(
      communication.id,
      { subject, html, recipients },
      event,
      minutesFromEvent
    );
  }

  res.send(communication);
});

router.delete("/api/communication", async (req, res) => {
  const { id } = req.query;
  const response = await Communication.destroy({ where: { id } });

  res.status(200).send({ response });
});

router.put("/api/communication", async (req, res) => {
  const { id, email } = req.body;
  const { recipients, status, subject, minutesFromEvent, html } = email;

  const communication = await Communication.findByPk(id);

  if (status === "Active" && recipients != "New Registrants") {
    // delete the old job because it could have stale data
    Scheduler.cancelSend(id.toString());
    // create a new job with fresh data

    scheduleJob(
      id.toString(),
      { subject, html, recipients },
      communication.EventId,
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

  communication.save();

  res.send(communication);
});

router.get("/api/communication/jobs", async (req, res) => {
  res.send(Scheduler.scheduledJobs());
});

router.post("/api/communication/jobs/cancel", async (req, res) => {
  const { id } = req.body;

  Scheduler.cancelSend(id);
});

router.get("/api/communication-list", async (req, res) => {
  const { emailId } = req.query;

  const emailListRecipients = await EmailListRecipient.findAll({
    where: { CommunicationId: emailId },
  });

  res.status(200).send(emailListRecipients);
});

router.post("/api/communication-list", async (req, res) => {
  const { data, emailId } = req.body;

  const { firstName, lastName, email } = data;

  const emailListRecipient = await EmailListRecipient.create({
    firstName,
    lastName,
    email,
    CommunicationId: emailId,
  });

  emailListRecipient.hash = md5(emailListRecipient.id);

  await emailListRecipient.save();

  res.status(200).send(emailListRecipient);
});

router.put("/api/communication-list", async (req, res) => {
  const { data, id } = req.body;

  const { firstName, lastName, email } = data;

  const emailListRecipient = EmailListRecipient.findByPk(id);

  emailListRecipient.firstName = firstName;
  emailListRecipient.lastName = lastName;
  emailListRecipient.email = email;
  await emailListRecipient.save();

  res.status(200).send(emailListRecipient);
});

router.delete("/api/communication-list", async (req, res) => {
  const { id } = req.query;

  const emailListRecipient = EmailListRecipient.findByPk(id);
  const response = await emailListRecipient.destroy();

  res.status(200).send({ response });
});

router.post("/api/communication/test", async (req, res) => {
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

  const recipientData = { ...event, ...testRecipient };

  const { success, failed } = await Mailer.mapVariablesAndSendEmail(
    [recipientData],
    subject,
    html
  );
  if (success) {
    res.status(200).send();
  } else {
    res.status(400).send();
  }
});

// HELPER FUNCTIONS

const scheduleJob = async (jobName, email, EventId, minutesFromEvent) => {
  const { subject, html, recipients } = email;

  const event = await Event.findByPk(EventId);
  const sendDate = new Date(event.startDate);

  sendDate.setMinutes(sendDate.getMinutes() + minutesFromEvent);

  Scheduler.scheduleSend(
    jobName,
    { to: "andrzejewski.d@gmail.com", subject, html, recipients },
    sendDate,
    EventId
  );
};

module.exports = router;
