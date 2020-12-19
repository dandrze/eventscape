const { response } = require("express");
const schedule = require("node-schedule");
const Mailer = require("./Mailer");
const { updateEmailJob } = require("../db/Email");

const scheduleSend = async (emailId, email, sendDate) => {
  console.log(sendDate);
  const newJob = schedule.scheduleJob(
    emailId.toString(),
    sendDate,
    function () {
      //send the email when the job is triggered
      Mailer.sendEmail(email);
      //  update the database to show that the email has been sent
      updateEmailJob(
        emailId,
        schedule.scheduledJobs[emailId.toString()].triggeredJobs(),
        schedule.scheduledJobs[emailId.toString()].nextInvocation()
      );
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
