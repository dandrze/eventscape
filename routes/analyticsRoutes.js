const express = require("express");
const { SiteVisit, Registration, SiteVisitor, Event } = require("../db").models;
const requireAuth = require("../middlewares/requireAuth");

const router = express.Router();

router.get(
  "/api/analytics/visitor-data",
  requireAuth,
  async (req, res, next) => {
    const { EventId } = req.query;

    try {
      const currentCount = await SiteVisit.count({
        where: {
          loggedOutAt: null,
          EventId,
        },
      });

      const uniqueCount = await SiteVisit.count({
        where: {
          EventId,
        },
        col: "SiteVisitorId",
        distinct: true,
      });

      const visitData = await SiteVisit.findAll({
        where: {
          EventId,
        },
        raw: true,
        order: [
          "id",
        ] /* ensures that the latest visit shows up last, required for mapping functions*/,
      });

      const siteVisitors = await SiteVisitor.findAll({
        where: {
          EventId,
        },
        include: Registration,
        raw: true,
      });

      const visitorData = siteVisitors.map((visitor) => {
        let timeViewed = 0;
        let lastLogout = null;
        for (let visit of visitData) {
          if (visit.SiteVisitorId === visitor.id) {
            if (visit.loggedOutAt) {
              lastLogout = Math.max(lastLogout, visit.loggedOutAt);
              timeViewed += visit.loggedOutAt - visit.createdAt;
            } else {
              lastLogout = null;
              timeViewed += new Date() - visit.createdAt;
            }
          }
        }
        return { ...visitor, timeViewed, lastLogout };
      });


      const history = await createVisitHistory(visitData, EventId);

      res.json({ currentCount, uniqueCount, visitorData, history, siteVisitors });
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/api/analytics/current-visitors",
  requireAuth,
  async (req, res, next) => {
    const { eventId } = req.query;

    try {
      const currentVisitors = await SiteVisit.count({
        where: {
          loggedOutAt: null,
          EventId: eventId,
        },
      });

      res.json({ currentVisitors });
    } catch (error) {
      next(error);
    }
  }
);

const createVisitHistory = async (visitData, EventId) => {
  // create a cleaner array for the time chart to use with just start time and end times
  const visitTimes = visitData.map((visit) => {
    const start = new Date(visit.createdAt);
    // if the user hasn't logged out yet, just return the current timestamp
    const end = visit.loggedOutAt ? new Date(visit.loggedOutAt) : new Date();

    return { start, end };
  });

  // set the lower and upper limits for the time chart
  const event = await Event.findByPk(EventId);

  const lowerLimit = event.startDate.getTime();
  const upperLimit = event.endDate.getTime();

  const visitArray = [];
  // for each minute in the time chart range, count how many visits are active (time falls between its start and end time)
  for (let i = lowerLimit; i < upperLimit; i += 60 * 1000) {
    let count = 0;
    for (const visitTime of visitTimes) {
      if (i > visitTime.start && i < visitTime.end) count++;
    }
    visitArray.push({ time: i, value: count });
  }

  return visitArray;
};

module.exports = router;
