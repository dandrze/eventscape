const { response } = require("express");
const schedule = require("node-schedule");
const Mailer = require("./Mailer");

const scheduleSend = async () => {
  var now = new Date();
  now.setSeconds(now.getSeconds() + 45);

  const scheduledSend = schedule.scheduleJob("myJob", now, function () {
    //Mailer.sendEmail();
    console.log("sent!");
  });

  console.log(scheduledSend);
};

const scheduledJobs = () => {
  var now = new Date();
  now.setSeconds(now.getSeconds() + 5);
  console.log(schedule.scheduledJobs);
  //console.log(schedule.scheduledJobs.myJob.cancel());
  console.log(schedule.scheduledJobs.myJob.reschedule(now));
};

const reschedule = (jobName) => {
  var now = new Date();
  now.setSeconds(now.getSeconds() + 5);
  schedule.scheduledJobs[jobName].reschedule(now);
};

exports.scheduleSend = scheduleSend;
exports.scheduledJobs = scheduledJobs;
exports.reschedule = reschedule;
