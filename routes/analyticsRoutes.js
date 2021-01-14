const express = require("express");
const { SiteVisit } = require("../sequelize").models;
const conn = require("../sequelize/conn");
const { QueryTypes } = require("sequelize");

const router = express.Router();

router.get("/api/analytics/visitor-data", async (req, res) => {
  const { eventId } = req.query;

  const currentCount = await SiteVisit.count({
    where: {
      loggedOutAt: null,
      eventId,
    },
  });

  const uniqueCount = await SiteVisit.count({
    where: {
      eventId,
    },
    col: "uniqueVisitorId",
    distinct: true,
  });

  const data = await SiteVisit.findAll({
    where: {
      eventId,
    },
  });

  res.status(200).send({ currentCount, uniqueCount, data });
});

module.exports = router;
