const express = require("express");
const md5 = require("md5");

const router = express.Router();

const db = require("../db");

router.get("/api/attendee/hash", async (req, res) => {
  const { hash } = req.query;

  // get the attendee information based on the hash
  const attendee = await db.query(`SELECT * FROM registration WHERE hash=$1`, [
    hash,
  ]);

  res.status(200).send(attendee.rows[0]);
});

module.exports = router;
