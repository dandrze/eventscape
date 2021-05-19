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

router.get("/api/billing/invoice", requireAuth, async (req, res, next) => {
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

// public route
router.get("/api/billing/pricing", async (req, res, next) => {
  try {
    const planTypes = await PlanType.findAll();

    res.json(planTypes);
  } catch (error) {
    next(error);
  }
});

router.get("/api/billing/plan", requireAuth, async (req, res, next) => {
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

router.put("/api/billing/plan", requireAuth, async (req, res, next) => {
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
    const event = await Event.findOne({
      where: { id: eventId },
      include: "Owner",
    });

    plan.viewers = viewers;
    plan.streamingTime = streamingTime;

    if (isUpgrade) {
      const paidPlan = await PlanType.findOne({ where: { type: "paid" } });

      // point the plan to the new paid plan
      plan.PlanTypeId = paidPlan.id;

      sendEmail({
        to: "kevin.richardson@eventscape.io",
        subject: "A user upgraded their event to premium",
        html: `<p>Event Id ${eventId} has upgraded their plan to premium. <br/> User Email: ${event.Owner.emailAddress} <br/> User Id: ${event.Owner.id} <br/> Viewers: ${viewers} <br/> Streaming Hours: ${streamingTime}</p>`,
      });
      sendEmail({
        to: "david.andrzejewski@eventscape.io",
        subject: "A user upgraded their event to premium",
        html: `<p>Event Id ${eventId} has upgraded their plan to premium. <br/> User Email: ${event.Owner.emailAddress} <br/> User Id: ${event.Owner.id} <br/> Viewers: ${viewers} <br/> Streaming Hours: ${streamingTime}</p>`,
      });
    }

    if (isCancel) {
      const freePlan = await PlanType.findOne({ where: { type: "free" } });

      plan.PlanTypeId = freePlan.id;

      sendEmail({
        to: "kevin.richardson@eventscape.io",
        subject: "A user downgraded their event to essentials",
        html: `<p>Event Id ${eventId} has downgraded their plan to essentials.<br/> User Email: ${event.Owner.emailAddress} <br/> User Id: ${event.Owner.id} `,
      });
      sendEmail({
        to: "david.andrzejewski@eventscape.io",
        subject: "A user downgraded their event to essentials",
        html: `<p>Event Id ${eventId} has downgraded their plan to essentials.<br/> User Email: ${event.Owner.emailAddress} <br/> User Id: ${event.Owner.id} `,
      });
    }

    const savedPlan = await plan.save();

    res.json(savedPlan);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
