import { recipients } from "../model/enums";

export const blankEmail = {
  subject: "Your subject goes here",
  recipients: recipients.ALL_REGISTRANTS,
  minutes_from_event: 0,
  html: `Blank email template goes here. This template is used when a user clicks on the add email button`,
};

export const invitation = {
  subject: "You are Invited To {Event_Name}",
  recipients: recipients.ALL_REGISTRANTS,
  minutes_from_event: -10080, // 7 days
  html: `Invitation email template goes here`,
};
export const registrationConfirmation = {
  subject: "Thank You for Registering for {Event_Name}",
  recipients: recipients.NEW_REGISTRANTS,
  html: `
  <p style="text-align: left">Hello {first_name},</p>
  <p style="text-align: left">Thank you for registering for {event_name}.</p>
  <p style="text-align: left">A few minutes before the event begins, please click the following button to join.</p>
  <p style="text-align: left;">
    <button style="
      font-family: Helvetica, Arial, sans-serif;
      font-weight: bold;
      font-size: 20;
      color: white;
      background-color: var(--main-color);
      padding: 16px;
      border-width: 2px;
      border-radius: 6px;
      border-color: var(--main-color);
      border-style: solid;
      height: min-content;
      text-align: left;
    ">
      Join Now
    </button>
  </p>
  
`,
};

export const reminderOneDay = {
  subject: "Reminder: {Event_Name} Tomorrow",
  recipients: recipients.ALL_REGISTRANTS,
  minutes_from_event: -1440, // 1 day
  html: `Reminder email template goes here`,
};

export const reminderOneHour = {
  subject: "Reminder: {Event_Name} in One Hour",
  recipients: recipients.ALL_REGISTRANTS,
  minutes_from_event: -60, // 1 hour
  html: `Reminder Email Template Goes Here`,
};

export const followUp = {
  subject: "Thank You for Attending {Event_Name}",
  recipients: recipients.ALL_REGISTRANTS,
  minutes_from_event: 180, // 6 hours
  html: `Thank you email template goes here`,
};
