const { response } = require("express");
const schedule = require("node-schedule");
const Mailer = require("./Mailer");
const { updateEmailJob } = require("../db/Email");

const scheduleSend = async (emailId, email, sendDate) => {
  const { to, subject, html } = email;
  console.log(sendDate);
  const newJob = schedule.scheduleJob(
    emailId.toString(),
    sendDate,
    function () {
      // asign job to the job within node-schedule
      const job = schedule.scheduledJobs[emailId.toString()];
      //send the email when the job is triggered
      Mailer.sendEmail({ to, subject, html });
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
