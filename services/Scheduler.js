const { response } = require("express");
const schedule = require("node-schedule");
const Mailer = require("./Mailer");
const { updateEmailJob } = require("../db/Email");
const { recipientsOptions } = require("../model/enums");
const db = require("../db/index");

const scheduleSend = async (emailId, email, sendDate, eventId) => {
  const { to, subject, html, recipients, emailList } = email;

  const newJob = schedule.scheduleJob(
    emailId.toString(),
    sendDate,
    async () => {
      // asign job to the job within node-schedule
      const job = schedule.scheduledJobs[emailId.toString()];
      // commented out all email send code, replaced with a console log instead
      console.log(email);
      /*
      var recipientsList = [];
      // get recipients either from the registration list, or use the email list provided
      switch (recipients) {
        case recipientsOptions.ALL_REGISTRANTS:
          const registrations = await db.query(
            "SELECT event.title as event_name, event.time_zone, event.link as event_link, event.start_date, event.end_date FROM registration INNER JOIN event on registration.event = event.id WHERE registration.event=$1 ",
            [eventId]
          );

          recipientsList = registrations.rows;
          break;
        case recipientsOptions.EMAIL_LIST:
          const emailListRecipients = await db.query(
            "SELECT * FROM recipient WHERE email_id=$1",
            [emailId]
          );

          recipientsList = emailListRecipients.rows.map(
            (recipient) => recipient.email
          );
          break;
      }

      // find all variable names in curly braces and put them in an array
      const subjectVariables = subject.match(/[^{\}]+(?=})/g);
      const htmlVariables = html.match(/[^{\}]+(?=})/g);
      //remove duplicates from the variables list
      subjectVariables = [...new Set(subjectVariables)];
      htmlVariables = [...new Set(htmlVariables)];

      //Iterate through the recipientsList and send an email to each recipient with variables replaced with database values
      for (const recipient of recipientsList) {
        // for each recipient, reset the subject to the original with {variable_names}
        var updatedSubject = subject;
        var updatedHtml = html;

        //for each variable in the subjectVariables array, replace it with the value from the database value
        for (var i = 0; i < subject.length; i++) {
          updatedSubject = updatedSubject.replace(
            new RegExp("{" + subjectVariables[i] + "}", "gi"),
            recipient[subjectVariables[i]]
          );
        }

        //for each variable in the htmlVariables array, replace it with the value from the database value
        for (var i = 0; i < subject.length; i++) {
          updatedHtml = updatedHtml.replace(
            new RegExp("{" + htmlVariables[i] + "}", "gi"),
            recipient[htmlVariables[i]]
          );
        }

        console.log({ to, updatedHtml, updatedSubject });

        /*Mailer.sendEmail({
          to: recipient.email,
          updatedSubject,
          updatedHtml,
        });
        */
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
