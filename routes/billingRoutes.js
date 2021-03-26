const express = require("express");
const router = express.Router();

const requireAuth = require("../middlewares/requireAuth");

const {
  Invoice,
  InvoiceLineItem,
  Plan,
  PlanType,
  CustomLineItem,
} = require("../db").models;

router.get("/api/invoice", async (req, res, next) => {
  const { eventId } = req.query;

  try {
    const invoice = await Invoice.findOne({
      where: { EventId: eventId },
      include: [
        {
          model: InvoiceLineItem,
          include: [{ model: Plan, include: PlanType }, CustomLineItem],
        },
        Plan,
      ],
    });

    res.status(200).send(invoice);
  } catch (error) {
    next(error);
  }
});

router.put("/api/invoice/plan", async (req, res, next) => {
  const { eventId, viewers, streamingTime } = req.body;

  try {
    const invoice = await Invoice.findOne({
      where: { EventId: eventId },
      include: Plan,
    });

    console.log(invoice);

    invoice.Plan.viewers = viewers;
    invoice.Plan.streamingTime = streamingTime;
    console.log(invoice);

    await invoice.Plan.save();

    res.status(200).send();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
