const { response } = require("express");
const schedule = require("node-schedule");
const Mailer = require("./Mailer");
const { updateEmailJob } = require("../db/Email");
const { recipientsOptions } = require("../model/enums");
const db = require("../db/index");
const { sub } = require("date-fns");

const scheduleSend = async (emailId, email, sendDate, eventId) => {
  const { to, subject, html, recipients, emailList } = email;

  const newJob = schedule.scheduleJob(
    emailId.toString(),
    sendDate,
    async () => {
      // asign job to the job within node-schedule
      const job = schedule.scheduledJobs[emailId.toString()];

      var recipientsList = [];
      // get recipients either from the registration list, or use the email list provided
      if (recipients === recipientsOptions.ALL_REGISTRANTS) {
        const registrationsList = await db.query(
          `SELECT 
            event.title as event_name, 
            event.timeZone, 
            event.link, 
            event.startDate, 
            event.endDate ,
            registration.firstName,
            registration.lastName,
            registration.email,
            registration.hash

            FROM registration INNER JOIN event on registration.event = event.id WHERE registration.event=$1 `,
          [eventId]
        );

        recipientsList = registrationsList.rows;
      } else if (recipients === recipientsOptions.EMAIL_LIST) {
        const emailList = await db.query(
          `SELECT 
            recipient.firstName,
            recipient.lastName,
            recipient.email,
            recipient.hash,
            event.title as event_name, 
            event.timeZone, 
            event.link, 
            event.startDate, 
            event.endDate
          FROM recipient 
          INNER JOIN email 
          on recipient.email_template_id = email.id 
          INNER JOIN event
          on email.event = event.id 
          WHERE recipient.email_template_id=$1`,
          [emailId]
        );

        recipientsList = emailList.rows;
      }

      // provide a list of recipient data, a subject and html with {variables} to a function that maps the data to the variables and sends an email to each recipient

      const { success, failed } = await Mailer.mapVariablesAndSendEmail(
        recipientsList,
        subject,
        html
      );

      console.log({ success, failed });

      updateEmailJob(
        emailId,
        job.triggeredJobs(),
        job.nextInvocation(),
        success,
        failed
      );

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
