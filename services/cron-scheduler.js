const cron = require("node-cron");
const { Communication, Event } = require("../db").models;
const { statusOptions, recipientsOptions } = require("../model/enums");
const { scheduleSend, cancelSend, scheduledJobIds } = require("./Scheduler");

const retrieveJobs = async () => {
  console.log("retrieving jobs");

  const communications = await Communication.findAll({
    where: {
      recipients: recipientsOptions.ALL_REGISTRANTS,
    },
    include: Event,
  });

  const activeCommunications = communications.filter(
    (communication) => communication.status === statusOptions.ACTIVE
  );
  const inactiveCommunications = communications.filter(
    (communication) => communication.status != statusOptions.ACTIVE
  );

  const currentJobs = scheduledJobIds();

  console.log(currentJobs);

  for (let communication of activeCommunications) {
    scheduleSend(
      communication.id,
      communication.Event.id,
      communication.Event.startDate,
      communication.minutesFromEvent
    );
  }

  for (let communication of inactiveCommunications) {
    if (communication.id in currentJobs) {
      cancelSend(communication.id);
    }
  }
};

module.exports = () => {
  // starts a cron job to check for new scheduled jobs every 5 minutes on the first process of the first dyno (or of the development server if in dev)
  if (
    (process.env.DYNO == "web.1" || process.env.NODE_ENV === "development") &&
    process.env.pm_id == 0
  ) {
    // retrieve all jobs as soon as the server starts
    retrieveJobs();
    cron.schedule("*/10 * * * * *", () => {
      // retrieve all jobs every 5 minutes
      retrieveJobs();
    });
  }
};
