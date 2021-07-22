const express = require("express");
const { Event, SiteVisitor, SiteVisit } = require("../db").models;

const router = express.Router();

router.get("/api/_crash", async (req, res, next) => {
  const userId = req.user.userId;

  if (userId === 3) {
    const failedEventCall = await Event.findOne({
      where: { columnDoesntExist: "some value" },
    });
  }
});

router.get("/api/test", async (req, res, next) => {
  const siteVisitors = await SiteVisitor.findAll({
    where: { RegistrationId: 167 },
    include: { model: SiteVisit, where: { loggedOutAt: null } },
  });

  res.json(siteVisitors);
});

module.exports = router;
