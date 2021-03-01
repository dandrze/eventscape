const express = require("express");
const router = express.Router();
const { Poll, PollOption, PollResponse } = require("../db").models;

const { clearCache } = require("../services/sequelizeRedis");

router.get("/api/polling/poll/all", async (req, res, next) => {
  const { eventId } = req.query;

  try {
    const polls = await Poll.findAll({
      where: {
        EventId: eventId,
      },
      include: PollOption,
    });

    res.status(200).send(polls);
  } catch (error) {
    next(error);
  }
});

router.get("/api/polling/results", async (req, res, next) => {
  `returns an object containing the results for each poll option for a given poll
  
  returns object
  
  example:
  {
    '10': 40,
    '11': 50
  }
  40 responses for PollOption 10 and 50 responses for PollOption 11`;
  const { pollId } = req.query;

  try {
    const pollOptions = await PollOption.findAll({ where: { PollId: pollId } });

    let result = {};

    for (let i = 0; i < pollOptions.length; i++) {
      const PollOptionId = pollOptions[i].id;
      const responsesCount = await PollResponse.count({
        where: { PollOptionId },
      });

      result[PollOptionId] = responsesCount;
    }

    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
});

router.delete("/api/polling/results", async (req, res, next) => {
  `Clears all results for a given poll`;
  const { pollId } = req.query;

  try {
    // Find all PollOptions under this poll
    const pollOptions = await PollOption.findAll({ where: { PollId: pollId } });
    // create an array of just their Ids
    const pollOptionIds = pollOptions.map((pollOption) => {
      return pollOption.id;
    });
    // delete all respones that contain these poll options
    await PollResponse.destroy({ where: { PollOptionId: pollOptionIds } });
    res.status(200).send();
  } catch (error) {
    next(error);
  }
});

router.post("/api/polling/poll", async (req, res, next) => {
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
        text: option.text,
      });
    }
    res.status(200).send();
  } catch (error) {
    next(error);
  }
});

router.delete("/api/polling/poll", async (req, res, next) => {
  const { pollId } = req.query;

  try {
    const poll = await Poll.findByPk(pollId);
    if (poll) await poll.destroy();

    res.status(200).send();
  } catch (error) {
    next(error);
  }
});

router.put("/api/polling/poll", async (req, res, next) => {
  const { pollId, question, options, allowMultiple, allowShare } = req.body;

  try {
    const poll = await Poll.findByPk(pollId);
    poll.question = question;
    poll.allowMultiple = allowMultiple;
    poll.allowShare = allowShare;
    poll.save();

    for (option of options) {
      // if there is no id, that means it's new so create a new poll option in the database
      if (!option.id) {
        PollOption.create({
          PollId: pollId,
          text: option.text,
        });
      } else {
        const pollOption = await PollOption.findByPk(option.id);
        pollOption.text = option.text;
        pollOption.save();
      }
    }

    const pollOptions = await PollOption.findAll({ where: { PollId: pollId } });

    // For each of the pollOptions returned from the database
    for (let pollOption of pollOptions) {
      if (
        !options
          .map((option) => {
            return option.id;
          })
          .includes(pollOption.id)
      ) {
        // if the incoming options do not include the database poll option, that means we deleted it, so delete the instance in the database
        pollOption.destroy();
      }
    }

    res.status(200).send();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
