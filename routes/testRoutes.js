const express = require("express");
const { Event, Account } = require("../db").models;

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
  //const account = await Account.findByPkCached(1);
  //res.send(account);
});

module.exports = router;
