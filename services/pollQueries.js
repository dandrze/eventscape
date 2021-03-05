const { Poll, PollOption, PollResponse } = require("../db").models;

const fetchPollResults = async (pollId) => {
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

  return { results, totalResponded };
};

module.exports = { fetchPollResults };
