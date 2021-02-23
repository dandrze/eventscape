const express = require("express");
const router = express.Router();
const { Poll, PollOption } = require("../db").models;

const { clearCache } = require("../services/sequelizeRedis");

router.post("/api/polling/create", async (req, res, next) => {
  const { eventId, question, options, allowMultiple, allowShare } = req.body;

  try {
    const poll = await Poll.create({
      EventId: eventId,
      question,
      allowMultiple,
      allowShare,
    });

    for (let option of options) {
      let pollOption = await PollOption.create({
        PollId: poll.id,
        text: option,
      });
    }
    res.status(200).send();
  } catch (error) {
    next(error);
  }
});

router.get("/api/polling", async (req, res, next) => {
  const { eventId } = req.query;

  try {
    const polls = await Poll.findAll({
      where: {
        EventId: eventId,
      },
    });

    res.status(200).send(polls);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
