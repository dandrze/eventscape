const express = require("express");
const { Event } = require("../db").models;

const router = express.Router();

router.get("/api/_crash", async (req, res, next) => {
  const userId = req.user.userId;

  if (userId === 3) {
    const failedEventCall = await Event.findOne({
      where: { columnDoesntExist: "some value" },
    });
  }
});

module.exports = router;
