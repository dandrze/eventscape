const express = require("express");
const md5 = require("md5");
const router = express.Router();

const requireAuth = require("../middlewares/requireAuth");

const {
  Invoice,
  InvoiceLineItem,
  Package,
  PackageType,
  CustomLineItem,
  Event,
  Account,
} = require("../db").models;

const { sendEmail } = require("../services/Mailer");

router.get("/api/billing/invoice", requireAuth, async (req, res, next) => {
  const { eventId } = req.query;

  try {
    const invoice = await Invoice.findOne({
      where: { EventId: eventId },
      include: [
        {
          model: InvoiceLineItem,
          include: [{ model: Package, include: PackageType }, CustomLineItem],
        },
      ],
    });

    res.json(invoice);
  } catch (error) {
    next(error);
  }
});

// public route
router.get("/api/billing/pricing", async (req, res, next) => {
  try {
    const packageTypes = await PackageType.findAll();

    res.json(packageTypes);
  } catch (error) {
    next(error);
  }
});

router.get("/api/billing/package", requireAuth, async (req, res, next) => {
  const { eventId } = req.query;

  try {
    const package = await Package.findOne({
      where: { EventId: eventId },
      include: PackageType,
    });

    res.json(package);
  } catch (error) {
    next(error);
  }
});

router.put("/api/billing/package", requireAuth, async (req, res, next) => {
  const { packageId, viewers, streamingTime, isUpgrade, isCancel, eventId } =
    req.body;

  try {
    const package = await Package.findByPk(packageId);
    const event = await Event.findOne({
      where: { id: eventId },
      include: "Owner",
    });

    package.viewers = viewers;
    package.streamingTime = streamingTime;

    if (isUpgrade) {
      const paidPackage = await PackageType.findOne({
        where: { type: "paid" },
      });

      // point the package to the new paid package
      package.PackageTypeId = paidPackage.id;

      sendEmail({
        to: "kevin.richardson@eventscape.io",
        subject: "A user upgraded their event to premium",
        html: `<p>Event Id ${eventId} has upgraded their package to premium. <br/> User Email: ${
          event.Owner.emailAddress
        } <br/> User Id: ${event.Owner.id} <br/> Event Name: ${
          event.title
        } <br/> Event Link: ${event.link}.eventscape.io/${
          event.registrationRequired ? md5(String(event.id)) : ""
        } <br/> Viewers: ${viewers} <br/> Streaming Hours: ${streamingTime}</p>`,
      });
      sendEmail({
        to: "david.andrzejewski@eventscape.io",
        subject: "A user upgraded their event to premium",
        html: `<p>Event Id ${eventId} has upgraded their package to premium. <br/> User Email: ${
          event.Owner.emailAddress
        } <br/> User Id: ${event.Owner.id} <br/> Event Name: ${
          event.title
        } <br/> Event Link: ${event.link}.eventscape.io/${
          event.registrationRequired ? md5(String(event.id)) : ""
        } <br/> Viewers: ${viewers} <br/> Streaming Hours: ${streamingTime}</p>`,
      });
    }

    if (isCancel) {
      const freePackage = await PackageType.findOne({
        where: { type: "free" },
      });

      package.PackageTypeId = freePackage.id;

      sendEmail({
        to: "kevin.richardson@eventscape.io",
        subject: "A user downgraded their event to essentials",
        html: `<p>Event Id ${eventId} has downgraded their package to essentials.<br/> User Email: ${
          event.Owner.emailAddress
        } <br/> User Id: ${event.Owner.id} <br/> Event Name: ${
          event.title
        } <br/> Event Link: https://${event.link}.eventscape.io/${
          event.registrationRequired ? md5(String(event.id)) : ""
        } <br/> `,
      });
      sendEmail({
        to: "david.andrzejewski@eventscape.io",
        subject: "A user downgraded their event to essentials",
        html: `<p>Event Id ${eventId} has downgraded their package to essentials.<br/> User Email: ${
          event.Owner.emailAddress
        } <br/> User Id: ${event.Owner.id} <br/> Event Name: ${
          event.title
        } <br/> Event Link: https://${event.link}.eventscape.io/${
          event.registrationRequired ? md5(String(event.id)) : ""
        } <br/> `,
      });
    }

    const savedPackage = await package.save();

    res.json(savedPackage);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
