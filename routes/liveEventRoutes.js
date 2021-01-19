const express = require("express");
const md5 = require("md5");

const router = express.Router();

const db = require("../db");

router.get("/api/attendee/hash", async (req, res) => {
  const { hash, eventId } = req.query;

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
    const res = await db.query(
      `SELECT * FROM registration WHERE hash=$1 AND event=$2`,
      [hash, eventId]
    );

    attendee = res.rows[0];
  }

  res.status(200).send(attendee);
});

module.exports = router;
