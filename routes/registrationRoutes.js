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
const requireAuth = require("../middlewares/requireAuth");

// publicly accessible endpoint
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
    res.json(registration);
  } catch (error) {
    next(error);
  }
});

router.put("/api/registration", requireAuth, async (req, res, next) => {
  const { id, values, emailAddress, firstName, lastName } = req.body;

  try {
    const registration = await Registration.findByPk(id);
    registration.values = values;
    registration.emailAddress = emailAddress;
    registration.firstName = firstName;
    registration.lastName = lastName;

    registration.save();

    res.json(registration);
  } catch (error) {
    next(error);
  }
});

router.post("/api/registration/bulk", requireAuth, async (req, res, next) => {
  const { registrations, eventId, shouldSendEmail } = req.body;

  try {
    // add EventId to registration object
    registrations.map((registration) => {
      registration.EventId = eventId;
      return registration;
    });

    // fetch event data
    const event = await Event.findByPk(eventId);

    for (let registration of registrations) {
      const result = await Registration.create(registration);
      // create a unique hash based on the id
      result.hash = md5(result.id);
      const newRegistration = await result.save();

      if (shouldSendEmail) {
        // get all emails for new registrants
        const communications = await Communication.findAll({
          where: {
            EventId: eventId,
            recipients: recipientsOptions.NEW_REGISTRANTS,
            status: statusOptions.ACTIVE,
          },
        });

        for (var communication of communications) {
          const { success, failed } = await Mailer.mapVariablesAndSendEmail(
            [{ ...result.dataValues, Event: event.dataValues }],
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
      }
    }

    res.json();
  } catch (error) {
    next(error);
  }
});

router.get("/api/registration/event", requireAuth, async (req, res, next) => {
  const { event } = req.query;

  try {
    const registrations = await Registration.findAll({
      where: {
        EventId: event,
      },
    });

    res.json(registrations);
  } catch (error) {
    next(error);
  }
});

// publicly accessible endpoint
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

    res.json(registration);
  } catch (error) {
    next(error);
  }
});

// public endpoint
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

    res.json();
  } catch (error) {
    next(error);
  }
});

router.delete("/api/registration/id", requireAuth, async (req, res, next) => {
  const { id } = req.query;
  try {
    const registration = await Registration.findByPk(id);
    await registration.destroy();

    res.json();
  } catch (error) {
    next(error);
  }
});

router.post("/api/form", requireAuth, async (req, res, next) => {
  const { event, data } = req.body;

  try {
    const [registrationForm] = await RegistrationForm.findOrCreate({
      where: { EventId: event },
    });

    registrationForm.data = data;
    await registrationForm.save();

    res.json();
  } catch (error) {
    next(error);
  }
});

// public endpoint. Required to populate custom fields.
router.get("/api/form", async (req, res, next) => {
  const { event } = req.query;

  try {
    const registrationForm = await RegistrationForm.findOne({
      where: { EventId: event },
    });

    res.json((registrationForm && registrationForm.data) || []);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
