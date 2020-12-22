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

      var recipientsList = [];
      // get recipients either from the registration list, or use the email list provided
      if (recipients === recipientsOptions.ALL_REGISTRANTS) {
        const registrationsList = await db.query(
          `SELECT 
            event.title as event_name, 
            event.time_zone, 
            event.link as event_link, 
            event.start_date, 
            event.end_date ,
            registration.first_name,
            registration.last_name,
            registration.email

            FROM registration INNER JOIN event on registration.event = event.id WHERE registration.event=$1 `,
          [eventId]
        );

        console.log(registrationsList);

        recipientsList = registrationsList.rows;
      } else if (recipients === recipientsOptions.EMAIL_LIST) {
        recipientsList = await db.query(
          "SELECT * FROM recipient WHERE email_id=$1",
          [emailId]
        ).rows;
      }

      console.log(recipientsList);

      // find all variable names in curly braces and put them in an array
      const subjectVariables = subject.match(/[^{\}]+(?=})/g);
      const htmlVariables = html.match(/[^{\}]+(?=})/g);

      //Iterate through the recipientsList and send an email to each recipient with variables replaced with database values
      for (const recipient of recipientsList) {
        // for each recipient, reset the subject to the original with {variable_names}
        var updatedSubject = subject;
        var updatedHtml = html;

        //for each variable in the subjectVariables array, replace it with the value from the database value. If the array is empty, skip it
        if (subjectVariables) {
          for (var i = 0; i < subject.length; i++) {
            updatedSubject = updatedSubject.replace(
              new RegExp("{" + subjectVariables[i] + "}", "gi"),
              recipient[subjectVariables[i]]
            );
          }
        }

        //for each variable in the htmlVariables array, replace it with the value from the database value. If the the array is empty, skip it
        if (htmlVariables) {
          for (var i = 0; i < subject.length; i++) {
            updatedHtml = updatedHtml.replace(
              new RegExp("{" + htmlVariables[i] + "}", "gi"),
              recipient[htmlVariables[i]]
            );
          }
        }

        Mailer.sendEmail({
          to: recipient.email,
          subject: updatedSubject,
          html: updatedHtml,
        });
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
