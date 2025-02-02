const express = require("express");
const router = express.Router();
const { Poll, PollOption, PollResponse, SiteVisitor, Registration } =
  require("../db").models;

const { clearCache } = require("../services/sequelizeRedis");
const { fetchPollResults } = require("../services/pollQueries");
const requireAuth = require("../middlewares/requireAuth");

router.get("/api/polling/poll/all", requireAuth, async (req, res, next) => {
  const { eventId } = req.query;

  try {
    const polls = await Poll.findAll({
      where: {
        EventId: eventId,
      },
      include: { model: PollOption, separate: true, order: [["id", "ASC"]] },
      order: [["id", "ASC"]],
    });

    res.json(polls);
  } catch (error) {
    next(error);
  }
});
router.get("/api/polling/data", requireAuth, async (req, res, next) => {
  const { eventId } = req.query;
  try {
    const pollResponses = await PollResponse.findAll({
      raw: true,
      include: [
        {
          model: PollOption,
          include: {
            model: Poll,
          },
        },

        { model: SiteVisitor, include: Registration },
      ],
      where: {
        "$PollOption.Poll.EventId$": eventId,
      },
    });

    res.json(pollResponses);
  } catch (error) {
    next(error);
  }
});

router.get("/api/polling/results", requireAuth, async (req, res, next) => {
  `returns an array of objects containing the results for each poll option for a given poll
  
  returns object
  
  example:
  {results: [{
    text: "poll option 10,
    responses: 40
  }, {
    text: "poll option 11",
    responses: 50
  }
],
responseCount= 90}
  40 responses for PollOption 10 and 50 responses for PollOption 11`;
  const { pollId } = req.query;

  try {
    const pollOptions = await PollOption.findAll({
      where: { PollId: pollId },
      include: Poll,
    });

    let results = [];

    const pollOptionIds = pollOptions.map((pollOption) => pollOption.id);

    // count the number of unique site visitors in poll responses for the poll options in this given poll
    const totalResponded = await PollResponse.count({
      where: { PollOptionId: pollOptionIds },
      distinct: true,
      col: "SiteVisitorId",
    });

    // iterate through each poll option and count how many total selections it received
    for (let i = 0; i < pollOptions.length; i++) {
      const PollOptionId = pollOptions[i].id;
      const pollSelections = await PollResponse.count({
        where: { PollOptionId },
      });

      results.push({
        text: pollOptions[i].text,
        selections: pollSelections,
      });
    }

    res.json({ results, totalResponded });
  } catch (error) {
    next(error);
  }
});

router.delete("/api/polling/results", requireAuth, async (req, res, next) => {
  `Clears all results for a given poll`;
  const { pollId } = req.query;

  try {
    // Find all PollOptions under this poll
    const pollOptions = await PollOption.findAll({ where: { PollId: pollId } });
    // create an array of just their Ids
    const pollOptionIds = pollOptions.map((pollOption) => pollOption.id);
    // delete all respones that contain these poll options
    await PollResponse.destroy({ where: { PollOptionId: pollOptionIds } });
    res.json();
  } catch (error) {
    next(error);
  }
});

router.post("/api/polling/poll/launch", requireAuth, async (req, res, next) => {
  const { pollId } = req.body;

  try {
    const poll = await Poll.findByPk(pollId);
    poll.isLaunched = true;
    poll.save();

    res.json();
  } catch (error) {
    next(error);
  }
});

router.post("/api/polling/poll", requireAuth, async (req, res, next) => {
  const { eventId, question, options, allowMultiple } = req.body;

  try {
    const poll = await Poll.create({
      EventId: eventId,
      question,
      allowMultiple,
      //allowShare,
    });

    for (let option of options) {
      PollOption.create({
        PollId: poll.id,
        text: option.text,
      });
    }
    res.json();
  } catch (error) {
    next(error);
  }
});

router.delete("/api/polling/poll", requireAuth, async (req, res, next) => {
  const { pollId } = req.query;

  try {
    const poll = await Poll.findByPk(pollId);
    if (poll) await poll.destroy();

    res.json();
  } catch (error) {
    next(error);
  }
});

router.put("/api/polling/poll", requireAuth, async (req, res, next) => {
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

    res.json();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
