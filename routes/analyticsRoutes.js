const express = require("express");
const { SiteVisit, Registration } = require("../sequelize").models;

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
    include: Registration,
  });

  const history = createVisitorsHistory(data);

  res.status(200).send({ currentCount, uniqueCount, data, history });
});

const createVisitorsHistory = (visitors) => {
  const startTimes = [];
  const endTimes = [];

  // create a cleaner array for the time chart to use with just start time and end times
  const visitTimes = visitors.map((visitor) => {
    const start = new Date(visitor.createdAt);
    // if the user hasn't logged out yet, just return the current timestamp
    const end = visitor.loggedOutAt
      ? new Date(visitor.loggedOutAt)
      : new Date();
    startTimes.push(start);
    endTimes.push(end);

    return { start, end };
  });

  // set the lower and upper limits for the time chart
  const startMiliseconds = startTimes.length
    ? Math.min(...startTimes)
    : new Date();
  const endMiliseconds = Math.max(...endTimes);

  const visitorsArray = [];
  // for each minute in the time chart range, count how many visits are active (time falls between its start and end time)
  for (let i = startMiliseconds; i < endMiliseconds; i += 60 * 1000) {
    let count = 0;
    for (const visitTime of visitTimes) {
      if (i > visitTime.start && i < visitTime.end) count++;
    }
    visitorsArray.push({ time: i, value: count });
  }

  return visitorsArray;
};

module.exports = router;
