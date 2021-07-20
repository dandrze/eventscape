const { sendEmail } = require("./Mailer");

const inviteUser = (
  emailAddress,
  inviterFirstName,
  eventTitle,
  eventId,
  isNewAccount
) => {
  console.log({
    emailAddress,
    inviterFirstName,
    eventTitle,
    eventId,
    isNewAccount,
  });
  const existingUserHtml = `
    <p style="text-align: left">Hello there,</p>
    <p style="text-align: left">Great news! ${inviterFirstName} has invited you to collaborate on their event, "${eventTitle}"</p>
 
        <a href="https://app.eventscape.io/?eventid=${eventId}">
         <p style="text-align: left;" >
            https://app.eventscape.io/?eventid=${eventId}
           </p>
        </a>
 
    <p style="text-align: left">Good luck on your event,</p>
    <p style="text-align: left">The Eventscape Team</p>
    <a href="https://www.eventscape.io"><p style="text-align: left">https://www.eventscape.io</p></a>
    `;

  const newUserHtml = `
    <p style="text-align: left">Hello there,</p>
    <p style="text-align: left">Great news! ${inviterFirstName} has invited you to collaborate on their event, "${eventTitle}" on EventScape.</p>
    <p style="text-align: left">To get started, create an Eventscape account by clicking the button below. You will automatically be added to the event when you complete registration.</p>
    <p style="text-align: left;" >
        <a href="https://app.eventscape.io/signup/${emailAddress}/?eventid=${eventId}">
        <button style="
            font-family: Helvetica, Arial, sans-serif;
            font-weight: bold;
            font-size: 20;
            color: white;
            background-color: #b0281c;
            padding: 16px;
            border-width: 2px;
            border-radius: 6px;
            border-color: #b0281c;
            border-style: solid;
            height: min-content;
            text-align: left;
        ">
            Accept Invitation
        </button>
        </a>
    </p>
    <p style="text-align: left">Good luck on your event,</p>
    <p style="text-align: left">The Eventscape Team</p>
    <a href="https://www.eventscape.io"><p style="text-align: left">https://www.eventscape.io</p></a>
    `;

  sendEmail({
    to: emailAddress,
    subject:
      "You've been invited to collaborate on an Eventscape virtual event",
    html: isNewAccount ? newUserHtml : existingUserHtml,
  });
};

module.exports = { inviteUser };
