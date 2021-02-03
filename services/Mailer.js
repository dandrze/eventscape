const sgMail = require("@sendgrid/mail");
const keys = require("../config/keys");

sgMail.setApiKey(keys.sendGridKey);

const sendEmail = async (email = { to: "", subject: "", html: "" }) => {
  const { to, subject, html } = email;
  const msg = {
    to,
    from: { email: "notifications@eventscape.io", name: "Eventscape" },
    subject,
    text: html,
    html,
  };

  try {
    const response = await sgMail.send(msg);
    return true;
  } catch (error) {
    return false;
  }
};

const mapVariablesAndSendEmail = async (recipientsList, subject, html) => {
  // find all variable names in curly braces and put them in an array
  const subjectVariables = subject.match(/[^{\}]+(?=})/g);
  const htmlVariables = html.match(/[^{\}]+(?=})/g);
  let success = 0;
  let failed = 0;
  const dateFormatOptions = {
    timeZoneName: "short",
    timeZone: recipientsList[0].Event.timeZone,
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  };

  //Iterate through the recipientsList and send an email to each recipient with variables replaced with database values
  for (const recipient of recipientsList) {
    // for each recipient, reset the subject to the original with {variable_names}
    var updatedSubject = subject;
    var updatedHtml = html;

    // creates snake case versions of camelcase varaibles

    recipient.first_name = recipient.firstName;
    recipient.last_name = recipient.lastName;
    recipient.email_address = recipient.emailAddress;
    recipient.event_name = recipient.Event.title;
    recipient.start_date = recipient.Event.startDate.toLocaleString(
      "en-us",
      dateFormatOptions
    );
    recipient.end_date = recipient.Event.endDate.toLocaleString(
      "en-us",
      dateFormatOptions
    );

    // the event_link variable is created using the event link and the recipient hash which uniquely identifies the recipient
    if (recipient.hash) {
      recipient.event_link =
        "https://" + recipient.Event.link + ".eventscape.io/" + recipient.hash;
    }

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
      for (var i = 0; i < html.length; i++) {
        updatedHtml = updatedHtml.replace(
          new RegExp("{" + htmlVariables[i] + "}", "gi"),
          recipient[htmlVariables[i]]
        );
      }
    }

    const isSuccessful = await sendEmail({
      to: recipient.emailAddress,
      subject: updatedSubject,
      html: updatedHtml,
    });
    if (isSuccessful) {
      success++;
    } else {
      failed++;
    }
  }

  return { success, failed };
};

exports.sendEmail = sendEmail;
exports.mapVariablesAndSendEmail = mapVariablesAndSendEmail;
