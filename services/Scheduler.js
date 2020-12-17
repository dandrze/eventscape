const { response } = require("express");
const schedule = require("node-schedule");
const Mailer = require("./Mailer");
const { updateEmailJob } = require("../db/Email");

const scheduleSend = async (emailId, email, sendDate) => {
  const scheduledSend = schedule.scheduleJob(
    emailId.toString(),
    sendDate,
    function () {
      //Mailer.sendEmail(email);
      console.log("sent!");
      // TODO update the database to show that the email has been sent
    }
  );

  console.log(scheduledSend.nextInvocation());

  updateEmailJob(
    emailId,
    scheduledSend.triggeredJobs(),
    scheduledSend.nextInvocation()
  );
};

const scheduledJobs = () => {
  console.log(schedule.scheduledJobs);
  console.log(schedule.scheduledJobs["75"].triggeredJobs());
  console.log(typeof schedule.scheduledJobs["75"].nextInvocation());
  console.log(schedule.scheduledJobs["75"].nextInvocation().CronDate);

  console.log(typeof schedule.scheduledJobs["75"].nextInvocation().CronDate);
  return schedule.scheduledJobs["75"].nextInvocation();
};

const reschedule = (jobName) => {
  var now = new Date();
  now.setSeconds(now.getSeconds() + 5);
  //schedule.scheduledJobs[jobName].reschedule(now);
};

exports.scheduleSend = scheduleSend;
exports.scheduledJobs = scheduledJobs;
exports.reschedule = reschedule;
