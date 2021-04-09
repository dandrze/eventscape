const schedule = require("node-schedule");

const Mailer = require("./Mailer");
const { recipientsOptions, statusOptions } = require("../model/enums");
const {
  Communication,
  Registration,
  Event,
  EmailListRecipient,
} = require("../db").models;

const scheduleSend = async (
  emailId,
  eventId,
  eventStartDate,
  minutesFromEvent
) => {
  const communication = await Communication.findByPk(emailId);
  const sendDate = new Date(eventStartDate);

  // delete the old job if it exists because it could have stale data
  cancelSend(emailId.toString());

  sendDate.setMinutes(sendDate.getMinutes() + minutesFromEvent);

  if (sendDate <= new Date()) {
    // if the send date is in the past, do not create a job
    communication.triggeredJobs = 0;
    communication.nextInvocation = null;

    await communication.save();
  } else {
    const newJob = schedule.scheduleJob(
      emailId.toString(),
      sendDate,
      async () => {
        // asign job to the job within node-schedule
        const job = schedule.scheduledJobs[emailId.toString()];

        // get latest email content at time of send
        const communication = await Communication.findByPk(emailId);
        const { subject, html, recipients } = communication;

        var recipientsList = [];
        // get recipients either from the registration list, or use the email list provided
        if (recipients === recipientsOptions.ALL_REGISTRANTS) {
          recipientsList = await Registration.findAll({
            where: { EventId: eventId },
            include: Event,
          });
        } else if (recipients === recipientsOptions.EMAIL_LIST) {
          recipientsList = await EmailListRecipient.findAll({
            where: { EventId: eventId },
            include: Event,
          });
        }

        // provide a list of recipient data, a subject and html with {variables} to a function that maps the data to the variables and sends an email to each recipient

        const { success, failed } = await Mailer.mapVariablesAndSendEmail(
          recipientsList,
          subject,
          html
        );

        const completeCommunication = await Communication.findByPk(emailId);

        completeCommunication.triggeredJobs = job.triggeredJobs();
        completeCommunication.nextInvocation = job.nextInvocation();
        completeCommunication.successfulSends = success;
        completeCommunication.failedSends = failed;

        // If the job was triggered, update the status to complete
        if (job.triggeredJobs() === 1) {
          completeCommunication.status = statusOptions.COMPLETE;
        }

        await completeCommunication.save();

        // We only ever need to run this job once. So remove it from node-schedule to keep things clean and avoid duplicate sends
        job.cancel();
      }
    );

    // update the communication triggered jobs (0) and nextInvocation (send date)

    communication.triggeredJobs = newJob.triggeredJobs();
    communication.nextInvocation = newJob.nextInvocation();

    await communication.save();
  }
};

const cancelSend = async (emailId) => {
  if (emailId in schedule.scheduledJobs) {
    const job = schedule.scheduledJobs[emailId];
    job.cancel();

    const communication = await Communication.findByPk(emailId);

    communication.triggeredJobs = job.triggeredJobs();
    communication.nextInvocation = job.nextInvocation();
    await communication.save();
  }
};

const scheduledJobs = async () => {
  var jobs = [];
  for (let jobName in schedule.scheduledJobs) {
    let job = schedule.scheduledJobs[jobName];
    const communication = await Communication.findOne({
      where: { id: job.name },
      include: Event,
    });

    jobs.push({
      name: job.name,
      communication,
    });
  }

  console.log(jobs);

  return jobs;
};

exports.scheduleSend = scheduleSend;
exports.scheduledJobs = scheduledJobs;
exports.cancelSend = cancelSend;
