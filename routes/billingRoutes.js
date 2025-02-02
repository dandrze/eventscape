const express = require("express");
const md5 = require("md5");
const router = express.Router();

const requireAuth = require("../middlewares/requireAuth");
const { statusOptions } = require("../model/enums");

const { License, LicenseModel, Event } = require("../db").models;

const { sendEmail } = require("../services/Mailer");
const { clearCache } = require("../services/sequelizeRedis");

router.get("/api/billing/license", requireAuth, async (req, res, next) => {
  const { eventId } = req.query;

  try {
    const license = await License.findOne({
      where: { EventId: eventId },
    });

    res.json(license);
  } catch (error) {
    next(error);
  }
});

router.get(
  "/api/billing/license-model",
  requireAuth,
  async (req, res, next) => {
    try {
      // fetches the latest license model by default
      const licenseModel = await LicenseModel.findAll({
        limit: 1,
        order: [["id", "DESC"]],
      });

      res.json(licenseModel[0]);
    } catch (error) {
      next(error);
    }
  }
);

router.post("/api/billing/license", requireAuth, async (req, res, next) => {
  const {
    eventId,
    basePrice,
    pricePerViewer,
    pricePerRegistration,
    includeCDN,
  } = req.body;

  try {
    const license = await License.create({
      EventId: eventId,
      pricePerViewer,
      pricePerRegistration,
      basePrice,
      includeCDN,
    });

    const event = await Event.findOne({
      where: { id: eventId },
      include: "Owner",
    });

    event.status = statusOptions.ACTIVE;
    await event.save();

    sendEmail({
      to: "kevin@eventscape.io",
      subject: "A user added a license",
      html: `<p>Event Id ${eventId} has upgraded to a license. <br/> User Email: ${
        event.Owner.emailAddress
      } <br/> User Id: ${event.Owner.id} <br/> Event Name: ${
        event.title
      } <br/> Event Link: ${event.link}.eventscape.io/${
        event.registrationRequired ? md5(String(event.id)) : ""
      } <br/> Is Registration Event: ${event.registrationRequired}
        <br/> Includes CDN: ${includeCDN}`,
    });
    sendEmail({
      to: "david@eventscape.io",
      subject: "A user added a license",
      html: `<p>Event Id ${eventId} has upgraded to a license. <br/> User Email: ${
        event.Owner.emailAddress
      } <br/> User Id: ${event.Owner.id} <br/> Event Name: ${
        event.title
      } <br/> Event Link: ${event.link}.eventscape.io/${
        event.registrationRequired ? md5(String(event.id)) : ""
      } <br/> Is Registration Event: ${event.registrationRequired}
      <br/> Includes CDN: ${includeCDN}`,
    });

    // Clear the cache which has the old event data without a license
    clearCache(`Event:link:${event.link}`);

    res.json(license);
  } catch (error) {
    next(error);
  }
});

router.delete("/api/billing/license", requireAuth, async (req, res, next) => {
  const { eventId } = req.query;

  try {
    const license = await License.findOne({ where: { EventId: eventId } });

    await license.destroy();

    const event = await Event.findOne({
      where: { id: eventId },
      include: "Owner",
    });

    event.status = statusOptions.DRAFT;
    await event.save();

    sendEmail({
      to: "kevin@eventscape.io",
      subject: "A user removed their event license",
      html: `<p>Event Id ${eventId} has downgraded their license to demo only.<br/> User Email: ${
        event.Owner.emailAddress
      } <br/> User Id: ${event.Owner.id} <br/> Event Name: ${
        event.title
      } <br/> Event Link: https://${event.link}.eventscape.io/${
        event.registrationRequired ? md5(String(event.id)) : ""
      } <br/> `,
    });
    sendEmail({
      to: "david@eventscape.io",
      subject: "A user removed their event license",
      html: `<p>Event Id ${eventId} has downgraded their license to demo only.<br/> User Email: ${
        event.Owner.emailAddress
      } <br/> User Id: ${event.Owner.id} <br/> Event Name: ${
        event.title
      } <br/> Event Link: https://${event.link}.eventscape.io/${
        event.registrationRequired ? md5(String(event.id)) : ""
      } <br/> `,
    });

    // Clear the cached event which has a license in it
    clearCache(`Event:link:${event.link}`);

    res.status(200).send();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
