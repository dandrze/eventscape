const sgMail = require("@sendgrid/mail");
const keys = require("../config/keys");

sgMail.setApiKey(keys.sendGridKey);

const sendEmail = async (
  email = { to: "", subject: "", html: "", useTemplate: false },
  from = { email: "notifications@eventscape.io", name: "Eventscape" }
) => {
  const { to, subject, html, useTemplate } = email;
  const template = `<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
  <html lang="en">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
  
    <title></title>
  
    <style type="text/css">
    </style>    
  </head>
  <body style="margin:0; padding:0; background-color:#F2F2F2;">
    <center>
      <table width="600px" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFF">
          <tr >
              <td align="center" valign="top" style="padding: 20px; border-bottom: 1px solid #e2e2e2;">
                  <a href="https://www.eventscape.io">
                    <img src="https://eventscape-assets.s3.amazonaws.com/logos/eventscape-logo.png" width="200px" />
                    </a>
                </td>
          </tr>
          <tr><td style="padding: 20px; border-bottom: 1px solid #e2e2e2;">${html}</td></tr>
          <tr><td align="center"  style="padding: 20px; color: grey;"><a href="https://www.eventscape.io">www.eventscape.io</a></td></tr>
      </table>
    </center>
  </body>
  </html>`;

  const msg = {
    to,
    from,
    subject,
    //text: emailContent.replace(/(<([^>]+)>)/gi, ""),
    html: useTemplate ? template : html,
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

  if (recipientsList.length > 0) {
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
      recipient.primary_color = recipient.Event.primaryColor;
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
          "https://" +
          recipient.Event.link +
          ".eventscape.io/" +
          recipient.hash;
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
        useTemplate: true,
      });
      if (isSuccessful) {
        success++;
      } else {
        failed++;
      }
    }
  }
  return { success, failed };
};

module.exports = { sendEmail, mapVariablesAndSendEmail };
