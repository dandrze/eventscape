const sgMail = require("@sendgrid/mail");
const keys = require("../config/keys");

sgMail.setApiKey(keys.sendGridKey);

const sendEmail = async (emailAddress) => {
  console.log(emailAddress);
  const { to, subject, html } = emailAddress;
  const msg = {
    to,
    from: "notifications@eventscape.io",
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

  //Iterate through the recipientsList and send an email to each recipient with variables replaced with database values
  for (const recipient of formatDate(recipientsList)) {
    // for each recipient, reset the subject to the original with {variable_names}
    var updatedSubject = subject;
    var updatedHtml = html;

    // the event_link variable is created using the event link and the recipient hash which uniquely identifies the recipient
    if (recipient.link && recipient.hash) {
      recipient.event_link =
        "https://" + recipient.link + ".eventscape.io/" + recipient.hash;
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

  console.log("mailer: ", { success, failed });
  return { success, failed };
};

const formatDate = (recipientsList) => {
  return recipientsList.map((recipient) => {
    const dateFormatOptions = {
      timeZoneName: "short",
      timeZone: recipient.time_zone,
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      timeZoneName: "short",
    };

    return {
      ...recipient,
      start_date: recipient.start_date.toLocaleString(
        "en-us",
        dateFormatOptions
      ),
      end_date: recipient.end_date.toLocaleString("en-us", dateFormatOptions),
    };
  });
};

exports.sendEmail = sendEmail;
exports.mapVariablesAndSendEmail = mapVariablesAndSendEmail;
