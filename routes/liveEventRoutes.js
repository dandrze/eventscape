const express = require("express");
const md5 = require("md5");
const { Registration, SiteVisit, SiteVisitor } = require("../db").models;

const router = express.Router();

// publically accessible route
router.get("/api/attendee/hash", async (req, res, next) => {
  const { hash, EventId } = req.query;

  try {
    var registration;
    var siteVisitors,
      activeDevices = [];

    // if the hash is a testing hash (hashed event id), return a test attendee
    if (hash === md5(String(EventId))) {
      // there is a test registration associated with this hash. It isn't tied to a single event
      registration = {
        isTestUser: true,
        firstName: "Test",
        lastName: "User",
        emailAddress: "test@user.com",
      };
      // Set activeDevices to 0 so that it doesn't trigger a device limit block
      activeDevices = 0;
    } else {
      // get the attendee information based on the hash
      registration = await Registration.findOne({ where: { hash, EventId } });

      if (registration) {
        siteVisitors = await SiteVisitor.findAll({
          where: { RegistrationId: registration.id },
          include: SiteVisit,
        });

        activeDevices = siteVisitors.filter(
          (siteVisitor) =>
            siteVisitor.SiteVisits.filter(
              (siteVisit) => siteVisit.loggedOutAt === null
            ).length > 0
        );
      }
    }

    res.json({ registration, activeDevices });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
