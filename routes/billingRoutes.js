const express = require("express");
const router = express.Router();

const requireAuth = require("../middlewares/requireAuth");

const {
  Invoice,
  InvoiceLineItem,
  Plan,
  PlanType,
  CustomLineItem,
  Event,
  Account,
} = require("../db").models;

const { sendEmail } = require("../services/Mailer");

router.get("/api/billing/invoice", async (req, res, next) => {
  const { eventId } = req.query;

  try {
    const invoice = await Invoice.findOne({
      where: { EventId: eventId },
      include: [
        {
          model: InvoiceLineItem,
          include: [{ model: Plan, include: PlanType }, CustomLineItem],
        },
      ],
    });

    res.json(invoice);
  } catch (error) {
    next(error);
  }
});

router.get("/api/billing/plan", async (req, res, next) => {
  const { eventId } = req.query;

  try {
    const plan = await Plan.findOne({
      where: { EventId: eventId },
      include: PlanType,
    });

    res.json(plan);
  } catch (error) {
    next(error);
  }
});

router.post("/api/billing/plan/upgrade", async (req, res, next) => {
  const { eventId } = req.body;

  try {
    const eventDetails = await Event.findOne({
      where: { id: eventId },
      include: "Owner",
    });

    const to = "andrzejewski.d@gmail.com";
    const subject = "Request to upgrade Eventscape to Premium";
    const html = `
    <div>
    ${eventDetails.Owner.firstName} ${eventDetails.Owner.lastName} has requested an upgrade to the professional plan for their event.
    <br/><br/>
    Event Id: ${eventDetails.id}
    <br/>
    Event Name: ${eventDetails.title}
    <br/>
    <br/>
    Owner Id: ${eventDetails.Owner.id}
    <br/>
    Owner Name: ${eventDetails.Owner.firstName} ${eventDetails.Owner.lastName}
    <br/>
    Owner Email Address: ${eventDetails.Owner.emailAddress}
    <div>
    `;

    sendEmail({ to, subject, html });

    res.status(200).send();
  } catch (error) {
    next(error);
  }
});

router.put("/api/billing/plan", async (req, res, next) => {
  const {
    planId,
    viewers,
    streamingTime,
    isUpgrade,
    isCancel,
    eventId,
  } = req.body;

  try {
    const plan = await Plan.findByPk(planId);

    plan.viewers = viewers;
    plan.streamingTime = streamingTime;

    if (isUpgrade) {
      const paidPlan = await PlanType.findOne({ where: { type: "paid" } });

      // point the plan to the new paid plan
      plan.PlanTypeId = paidPlan.id;
    }

    if (isCancel) {
      const freePlan = await PlanType.findOne({ where: { type: "free" } });

      plan.PlanTypeId = freePlan.id;
    }

    const savedPlan = await plan.save();

    res.json(savedPlan);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
