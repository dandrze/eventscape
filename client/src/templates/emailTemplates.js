import { recipientsOptions, statusOptions } from "../model/enums";

export const blankEmail = {
  status: statusOptions.DRAFT,
  subject: "",
  recipients: recipientsOptions.ALL_REGISTRANTS,
  minutes_from_event: 0,
  html: ``,
};

export const invitation = {
  status: statusOptions.DRAFT,
  subject: "You are Invited To {event_name}",
  recipients: recipientsOptions.ALL_REGISTRANTS,
  minutes_from_event: -10080, // 7 days before event start
  html: `Invitation email template goes here`,
};
export const registrationConfirmation = {
  status: statusOptions.ACTIVE,
  subject: "Registration Confirmation for {event_name}",
  recipients: recipientsOptions.NEW_REGISTRANTS,
  html: `
  <p style="text-align: left">Hello {first_name},</p>
  <p style="text-align: left">Thank you for registering for {event_name} starting {start_date}.</p>
  <p style="text-align: left">A few minutes before the event begins, please click the following button to join.</p>
  <p style="text-align: left;" contenteditable="false">
    <a href="{event_link}">
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
        Join Now
      </button>
    </a>
  </p>
  <p style="text-align: left, font-size: 10px">Or click {event_link}</p>
  <p style="text-align: left">Please note, this unique link is your ticket to the event and shouldn't be shared with others.</p>
  <p style="text-align: left">Thank you.</p>
`,
};

export const reminderOneDay = {
  status: statusOptions.ACTIVE,
  subject: "Reminder: {event_name} Tomorrow",
  recipients: recipientsOptions.ALL_REGISTRANTS,
  minutes_from_event: -1440, // 1 day before event start
  html: `
  <p style="text-align: left">Hello {first_name},</p>
  <p style="text-align: left">This email is to remind you that {event_name} starts tomorrow {start_date}.</p>
  <p style="text-align: left">A few minutes before the event begins, please click the following button to join.</p>
  <p style="text-align: left;" contenteditable="false">
    <a href="{event_link}">
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
        Join Now
      </button>
    </a>
  </p>
  <p style="text-align: left, font-size: 10px">Or click {event_link}</p>
  <p style="text-align: left">Please note, this unique link is your ticket to the event and shouldn't be shared with others.</p>
  <p style="text-align: left">Thank you.</p>
  `,
};

export const reminderOneHour = {
  status: statusOptions.ACTIVE,
  subject: "Reminder: {event_name} in One Hour",
  recipients: recipientsOptions.ALL_REGISTRANTS,
  minutes_from_event: -60, // 1 hour before event start
  html: `
  <p style="text-align: left">Hello {first_name},</p>
  <p style="text-align: left">This email is to remind you that {event_name} starts in one hour ({start_date}).</p>
  <p style="text-align: left">A few minutes before the event begins, please click the following button to join.</p>
  <p style="text-align: left;" contenteditable="false">
    <a href="{event_link}">
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
        Join Now
      </button>
    </a>
  </p>
  <p style="text-align: left, font-size: 10px">Or click {event_link}</p>
  <p style="text-align: left">Please note, this unique link is your ticket to the event and shouldn't be shared with others.</p>
  <p style="text-align: left">Thank you.</p>
  `,
};

export const followUp = {
  status: statusOptions.DRAFT,
  subject: "Thank You for Attending {event_name}",
  recipients: recipientsOptions.ALL_REGISTRANTS,
  minutes_from_event: 1440, // 24 hours after event start
  html: `
  <p style="text-align: left">Hello {first_name},</p>
  <p style="text-align: left">Thank you for attending {event_name} yesterday.</p>
  <p style="text-align: left">If you were unable to attend or would like to see the event again, you can view the recording at {event_link}</p>
  <p style="text-align: left">Thank you.</p>
  `,
};
