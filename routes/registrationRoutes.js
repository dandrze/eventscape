const express = require("express");
const md5 = require("md5");
const { QueryTypes } = require("sequelize");

const router = express.Router();
const { recipientsOptions, statusOptions } = require("../model/enums");
const Mailer = require("../services/Mailer");

const {
  sequelize,
  models: { Registration, Communication, Event, RegistrationForm },
} = require("../db");

router.post("/api/registration", async (req, res, next) => {
  const { EventId, values, emailAddress, firstName, lastName } = req.body;

  // Add the registered user

  const registration = await Registration.create({
    firstName,
    lastName,
    values,
    emailAddress,
    EventId: EventId,
  }).catch(next);

  registration.hash = md5(registration.id);
  registration.save();

  // get all emails for new registrants
  const communications = await Communication.findAll({
    where: {
      EventId: EventId,
      recipients: recipientsOptions.NEW_REGISTRANTS,
      status: statusOptions.ACTIVE,
    },
  }).catch(next);

  // pull all relevant data to map to variables and put them into a list
  const registrationData = await Registration.findByPk(registration.id, {
    include: Event,
  }).catch(next);

  for (var communication of communications) {
    const { success, failed } = await Mailer.mapVariablesAndSendEmail(
      [registrationData],
      communication.subject,
      communication.html
    ).catch(next);

    if (failed > 0) {
      res
        .status(500)
        .json({ message: "Error when sending confirmation email" });
      return;
    }
  }

  //if no errors were triggered and sent (res.status.(500).send()) then everything worked and send the new regsitration
  res.status(200).send(registration);
});

router.put("/api/registration", async (req, res, next) => {
  const { id, values, emailAddress, firstName, lastName } = req.body;

  const registration = await Registration.findByPk(id).catch(next);
  registration.values = values;
  registration.emailAddress = emailAddress;
  registration.firstName = firstName;
  registration.lastName = lastName;

  registration.save();

  res.status(200).send(registration);
});

router.get("/api/registration/event", async (req, res, next) => {
  const { event } = req.query;

  const registrations = await Registration.findAll({
    where: {
      EventId: event,
    },
  }).catch(next);

  res.status(200).send(registrations);
});

router.get("/api/registration/email", async (req, res, next) => {
  const { emailAddress, EventId } = req.query;

  // Get the registration associated with an email
  const registration = await Registration.findOne({
    where: {
      emailAddress,
      EventId,
    },
  }).catch(next);

  res.status(200).send(registration);
});

router.get("/test", async (req, res, next) => {
  const registration = await Registration.create({
    firstName: "fdasfa",
    EventId: 5,
  }).catch(next);

  const updatedRegistration = await registration.save().catch(next);

  res.send(updatedRegistration);
});

router.post("/api/registration/email/resend", async (req, res, next) => {
  const { emailAddress, EventId } = req.body;

  // pull all relevant data to map to variables and put them into a list
  const registrationData = await Registration.findOne({
    where: {
      emailAddress,
      EventId,
    },
    include: Event,
  }).catch(next);

  // check to see if any emails need to be fired off
  const communications = await Communication.findAll({
    where: {
      EventId,
      recipients: recipientsOptions.NEW_REGISTRANTS,
      status: statusOptions.ACTIVE,
    },
  }).catch(next);

  for (var communication of communications) {
    const { success, failed } = await Mailer.mapVariablesAndSendEmail(
      [registrationData],
      communication.subject,
      communication.html
    ).catch(next);

    if (failed > 0) {
      return res
        .status(500)
        .json({ message: "Error when sending confirmation email" });
    }
  }

  res.status(200).send();
});

router.delete("/api/registration/id", async (req, res, next) => {
  const { id } = req.query;
  const registration = await Registration.findByPk(id).catch(next);
  await registration.destroy().catch(next);

  res.status(200).send();
});

router.post("/api/form", async (req, res, next) => {
  const { event, data } = req.body;

  const [registrationForm] = await RegistrationForm.findOrCreate({
    where: { EventId: event },
  }).catch(next);

  registrationForm.data = data;
  await registrationForm.save().catch(next);

  res.status(200).send();
});

router.get("/api/form", async (req, res, next) => {
  const { event } = req.query;

  const registrationForm = await RegistrationForm.findOne({
    where: { EventId: event },
  }).catch(next);

  res.status(200).send((registrationForm && registrationForm.data) || []);
});

module.exports = router;
