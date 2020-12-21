const { response } = require("express");
const schedule = require("node-schedule");
const Mailer = require("./Mailer");
const { updateEmailJob } = require("../db/Email");
const { recipientsOptions } = require("../model/enums");
const db = require("../db/index");

const scheduleSend = async (emailId, email, sendDate, eventId) => {
  const { to, subject, html, replyTo, recipients } = email;

  const newJob = schedule.scheduleJob(
    emailId.toString(),
    sendDate,
    async () => {
      var recipientsList = [];
      // get recipients either from the registration list, or use the email list provided
      switch (recipients) {
        case recipientsOptions.ALL_REGISTRANTS:
          const registrations = await db.query(
            "SELECT * FROM registration WHERE event=$1",
            [eventId]
          );

          recipientsList = registrations.rows.map(
            (registration) => registration.email
          );
          break;
        case recipientsOptions.EMAIL_LIST:
          // TODO fetch the emaillist for this email
          break;
      }
      // asign job to the job within node-schedule
      const job = schedule.scheduledJobs[emailId.toString()];
      //send the email when the job is triggered
      for (const to of recipientsList) {
        Mailer.sendEmail({ to, subject, html, replyTo });
      }
      //  update the database to show that the email has been sent
      updateEmailJob(emailId, job.triggeredJobs(), job.nextInvocation());

      // We only ever need to run this job once. So remove it from node-schedule to keep things clean and avoid duplicate sends
      job.cancel();
    }
  );

  updateEmailJob(emailId, newJob.triggeredJobs(), newJob.nextInvocation());
  console.log(schedule.scheduledJobs);
};

const cancelSend = (emailId) => {
  if (emailId in schedule.scheduledJobs) {
    const job = schedule.scheduledJobs[emailId];
    job.cancel();

    updateEmailJob(emailId, job.triggeredJobs(), job.nextInvocation());
  }
  console.log(schedule.scheduledJobs);
};

const scheduledJobs = () => {
  return schedule.scheduledJobs;
};

exports.scheduleSend = scheduleSend;
exports.scheduledJobs = scheduledJobs;
exports.cancelSend = cancelSend;
