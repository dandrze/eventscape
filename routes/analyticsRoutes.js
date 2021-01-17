const express = require("express");
const { SiteVisit, Registration, SiteVisitor } = require("../sequelize").models;
const db = require("../db");

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
    col: "SiteVisitorId",
    distinct: true,
  });

  const data = await SiteVisit.findAll({
    where: {
      eventId,
    },
    include: {
      model: SiteVisitor,
      include: Registration,
    },
  });

  const history = await createVisitorsHistory(data, eventId);

  res.status(200).send({ currentCount, uniqueCount, data, history });
});

const createVisitorsHistory = async (visitors, eventId) => {
  // create a cleaner array for the time chart to use with just start time and end times
  const visitTimes = visitors.map((visitor) => {
    const start = new Date(visitor.createdAt);
    // if the user hasn't logged out yet, just return the current timestamp
    const end = visitor.loggedOutAt
      ? new Date(visitor.loggedOutAt)
      : new Date();

    return { start, end };
  });

  // set the lower and upper limits for the time chart
  const events = await db.query(
    "SELECT * FROM event WHERE id=$1",
    [eventId],
    (err, res) => {
      if (err) {
        throw res.status(500).send(err);
      }
    }
  );

  const lowerLimit = events.rows[0].start_date.getTime();
  const upperLimit = events.rows[0].end_date.getTime();

  const visitorsArray = [];
  // for each minute in the time chart range, count how many visits are active (time falls between its start and end time)
  for (let i = lowerLimit; i < upperLimit; i += 60 * 1000) {
    let count = 0;
    for (const visitTime of visitTimes) {
      if (i > visitTime.start && i < visitTime.end) count++;
    }
    visitorsArray.push({ time: i, value: count });
  }

  return visitorsArray;
};

module.exports = router;
