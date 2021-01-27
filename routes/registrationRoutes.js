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

  try {
    const registration = await Registration.create({
      firstName,
      lastName,
      values,
      emailAddress,
      EventId: EventId,
    });

    registration.hash = md5(registration.id);
    registration.save();

    // get all emails for new registrants
    const communications = await Communication.findAll({
      where: {
        EventId: EventId,
        recipients: recipientsOptions.NEW_REGISTRANTS,
        status: statusOptions.ACTIVE,
      },
    });

    // pull all relevant data to map to variables and put them into a list
    const registrationData = await Registration.findByPk(registration.id, {
      include: Event,
    });

    for (var communication of communications) {
      const { success, failed } = await Mailer.mapVariablesAndSendEmail(
        [registrationData],
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
  } catch (error) {
    next(error);
  }
});

router.put("/api/registration", async (req, res, next) => {
  const { id, values, emailAddress, firstName, lastName } = req.body;

  try {
    const registration = await Registration.findByPk(id);
    registration.values = values;
    registration.emailAddress = emailAddress;
    registration.firstName = firstName;
    registration.lastName = lastName;

    registration.save();

    res.status(200).send(registration);
  } catch (error) {
    next(error);
  }
});

router.get("/api/registration/event", async (req, res, next) => {
  const { event } = req.query;

  try {
    const registrations = await Registration.findAll({
      where: {
        EventId: event,
      },
    });

    res.status(200).send(registrations);
  } catch (error) {
    next(error);
  }
});

router.get("/api/registration/email", async (req, res, next) => {
  const { emailAddress, EventId } = req.query;

  try {
    // Get the registration associated with an email
    const registration = await Registration.findOne({
      where: {
        emailAddress,
        EventId,
      },
    });

    res.status(200).send(registration);
  } catch (error) {
    next(error);
  }
});

router.post("/api/registration/email/resend", async (req, res, next) => {
  const { emailAddress, EventId } = req.body;

  try {
    // pull all relevant data to map to variables and put them into a list
    const registrationData = await Registration.findOne({
      where: {
        emailAddress,
        EventId,
      },
      include: Event,
    });

    // check to see if any emails need to be fired off
    const communications = await Communication.findAll({
      where: {
        EventId,
        recipients: recipientsOptions.NEW_REGISTRANTS,
        status: statusOptions.ACTIVE,
      },
    });

    for (var communication of communications) {
      const { success, failed } = await Mailer.mapVariablesAndSendEmail(
        [registrationData],
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
  } catch (error) {
    next(error);
  }
});

router.delete("/api/registration/id", async (req, res, next) => {
  const { id } = req.query;
  try {
    const registration = await Registration.findByPk(id);
    await registration.destroy();

    res.status(200).send();
  } catch (error) {
    next(error);
  }
});

router.post("/api/form", async (req, res, next) => {
  const { event, data } = req.body;

  try {
    const [registrationForm] = await RegistrationForm.findOrCreate({
      where: { EventId: event },
    });

    registrationForm.data = data;
    await registrationForm.save();

    res.status(200).send();
  } catch (error) {
    next(error);
  }
});

router.get("/api/form", async (req, res, next) => {
  const { event } = req.query;

  try {
    const registrationForm = await RegistrationForm.findOne({
      where: { EventId: event },
    });

    res.status(200).send((registrationForm && registrationForm.data) || []);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
