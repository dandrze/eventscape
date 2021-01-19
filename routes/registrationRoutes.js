const express = require("express");
const md5 = require("md5");
const { QueryTypes } = require("sequelize");

const router = express.Router();
const { recipientsOptions, statusOptions } = require("../model/enums");
const Mailer = require("../services/Mailer");

const {
  Registration,
  Communication,
  Event,
  RegistrationForm,
} = require("../sequelize").models;
const sequelize = require("../sequelize/sequelize");

router.post("/api/registration", async (req, res) => {
  const { event, values, emailAddress, firstName, lastName } = req.body;

  // Add the registered user

  const registration = await Registration.create({
    firstName,
    lastName,
    values,
    emailAddress,
    EventId: event,
  });

  registration.hash = md5(registration.id);
  registration.save();

  // get all emails for new registrants
  const communications = await Communication.findAll({
    where: {
      EventId: event,
      recipients: recipientsOptions.NEW_REGISTRANTS,
      status: statusOptions.ACTIVE,
    },
  });

  // pull all relevant data to map to variables and put them into a list
  // we need to use a raw query to avoid having a nested result, we want it all in 1 dimensional object
  const registrationData = await sequelize.query(
    `SELECT 
      "Events".title, 
      "Events"."timeZone", 
      "Events".link, 
      "Events"."startDate", 
      "Events"."endDate",
      "Registrations"."firstName",
      "Registrations"."lastName",
      "Registrations"."emailAddress",
      "Registrations".hash

      FROM "Registrations" INNER JOIN "Events" on "Registrations"."EventId" = "Events".id WHERE "Registrations".id=$1 AND "Events".id=$2`,
    {
      bind: [registration.id, event],
      type: QueryTypes.SELECT,
    }
  );

  console.log(communications);

  for (var communication of communications) {
    const { success, failed } = await Mailer.mapVariablesAndSendEmail(
      registrationData,
      communication.subject,
      communication.html
    );

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

router.put("/api/registration", async (req, res) => {
  const { id, values, emailAddress, firstName, lastName } = req.body;

  const registration = await Registration.findByPk(id);
  registration.values = values;
  registration.emailAddress = emailAddress;
  registration.firstName = firstName;
  registration.lastName = lastName;

  registration.save();

  res.status(200).send(registration);
});

router.get("/api/registration/event", async (req, res) => {
  const { event } = req.query;

  const registrations = await Registration.findAll({
    where: {
      EventId: event,
    },
  });

  res.status(200).send(registrations);
});

router.get("/api/registration/email", async (req, res) => {
  const { emailAddress, eventId } = req.query;

  // Get the registration associated with an email
  const registrations = await Registration.findOne({
    where: {
      emailAddress,
      EventId: eventId,
    },
  });

  res.status(200).send(registrations);
});

router.post("/api/registration/email/resend", async (req, res) => {
  const { email, event } = req.body;

  // pull all relevant data to map to variables and put them into a list
  // we need to use a raw query to avoid having a nested result, we want it all in 1 dimensional object
  const registrationData = await sequelize.query(
    `SELECT 
      "Events".title, 
      "Events"."timeZone", 
      "Events".link, 
      "Events"."startDate", 
      "Events"."endDate",
      "Registrations"."firstName",
      "Registrations"."lastName",
      "Registrations"."emailAddress",
      "Registrations".hash

      FROM "Registrations" INNER JOIN "Events" on "Registrations"."EventId" = "Events".id WHERE "Registrations".id=$1 AND "Events".id=$2`,
    {
      bind: [registration.id, event],
      type: QueryTypes.SELECT,
    }
  );

  // check to see if any emails need to be fired off
  const communications = await Communication.findAll({
    where: {
      EventId: event,
      recipients: recipientsOptions.NEW_REGISTRANTS,
      status: statusOptions.ACTIVE,
    },
  });

  for (var communication of communications) {
    const { success, failed } = await Mailer.mapVariablesAndSendEmail(
      registrationData,
      communication.subject,
      communication.html
    );

    if (failed > 0) {
      return res
        .status(500)
        .json({ message: "Error when sending confirmation email" });
    }
  }

  res.status(200).send();
});

router.delete("/api/registration/id", async (req, res) => {
  const { id } = req.query;
  const registration = await Registration.findByPk(id);
  await registration.destroy();

  res.status(200).send();
});

router.post("/api/form", async (req, res) => {
  const { event, data } = req.body;

  const [registrationForm] = await RegistrationForm.findOrCreate({
    where: { EventId: event },
  });

  registrationForm.data = data;
  await registrationForm.save();

  res.status(200).send();
});

router.get("/api/form", async (req, res) => {
  const { event } = req.query;

  const registrationForm = await RegistrationForm.findOne({
    where: { EventId: event },
  });

  res.status(200).send((registrationForm && registrationForm.data) || []);
});

module.exports = router;
