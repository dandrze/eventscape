const express = require("express");
const md5 = require("md5");
const { Registration } = require("../db").models;

const router = express.Router();

router.get("/api/attendee/hash", async (req, res) => {
  const { hash, EventId } = req.query;

  var attendee;
  // if the hash is a testing hash, return a test attendee
  if (hash === md5("tester")) {
    attendee = {
      firstName: "Test",
      lastName: "Guest",
      email: "test@guest.com",
    };
  } else {
    // get the attendee information based on the hash
    attendee = await Registration.findOne({ where: { hash, EventId } });
  }

  res.status(200).send(attendee);
});

module.exports = router;
