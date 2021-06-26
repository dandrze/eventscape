import { recipientsOptions, statusOptions } from "../model/enums";

export const blankEmail = {
  status: statusOptions.DRAFT,
  subject: "",
  recipients: recipientsOptions.ALL_REGISTRANTS,
  minutesFromEvent: 0,
  html: ``,
};

export const invitation = {
  status: statusOptions.DRAFT,
  subject: "You are Invited To {event_name}",
  recipients: recipientsOptions.ALL_REGISTRANTS,
  minutesFromEvent: -10080, // 7 days before event start
  html: `Invitation email template goes here`,
};
export const registrationConfirmation = {
  status: statusOptions.ACTIVE,
  subject: "Registration Confirmation for {event_name}",
  recipients: recipientsOptions.NEW_REGISTRANTS,
  html: `
  <div style="
						background-color: #EFEFEF;
						position: absolute;
						top: 0;
						left: 0;
						width: 100%;
						height: 100%;
						font-family: Roboto, Helvetica, Ariel, sans-serif;
						font-weight: 400;
						box-sizing: border-box;
						font-size: 18px;">
	<div style="
							max-width: 800px;
							margin: 0 auto;">
		<div style="
								background-color: white;
								box-sizing: border-box;
								margin: 50px 20px;
								border-style: solid;
								border-width: 1px;
								border: #f1f1f2;
								box-shadow: 0px 3px 16px rgba(0, 0, 0, 0.03);">
			<div style="
									background-color: {primary_color};
									color: white;
									font-size: 28px;
									font-weight: 300;
									text-align: center;
									width: 100%;">
				<div style="padding: 20px;">{event_name}</div></div>
			<div style="
									padding: 8%;">
				<div style="text-align: left;">Hello {first_name},</div>
				<br>
				<div style="text-align: left;">You are confirmed to attend {event_name} starting {start_date}.</div>
				<br>
				<div style="text-align: left;">A few minutes before the event begins, please click the following button to join.</div>
				<br>
				<div contenteditable="false" style="text-align: left;"><a href="{event_link}"><button style="
					font-family: Helvetica, Arial, sans-serif;
					font-weight: bold;
					font-size: 20;
					color: white;
					background-color: {primary_color};
					padding: 16px;
					border-width: 2px;
					border-radius: 6px;
					border-color: {primary_color};
					border-style: solid;
					height: min-content;
					cursor: pointer;
					text-align: left;">Join Now</button></a></div>
				<br>
				<div style="text-align: left, font-size: 10px;">Or click {event_link}</div>
				<div style="text-align: left;
										color: grey;
										font-size: 15px;
										margin-left: 20px;">*Please note, this unique link is your ticket to the event and shouldn't be shared with others.</div>
				<br>
				<div style="text-align: left;">Thank you.</div></div></div></div></div>
`,
};

export const reminderOneDay = {
  status: statusOptions.ACTIVE,
  subject: "Reminder: {event_name} Tomorrow",
  recipients: recipientsOptions.ALL_REGISTRANTS,
  minutesFromEvent: -1440, // 1 day before event start
  html: `
  <div style="
						background-color: #EFEFEF;
						position: absolute;
						top: 0;
						left: 0;
						width: 100%;
						height: 100%;
						font-family: Roboto, Helvetica, Ariel, sans-serif;
						font-weight: 400;
						box-sizing: border-box;
						font-size: 18px;">
	<div style="
							max-width: 800px;
							margin: 0 auto;">
		<div style="
								background-color: white;
								box-sizing: border-box;
								margin: 50px 20px;
								border-style: solid;
								border-width: 1px;
								border: #f1f1f2;
								box-shadow: 0px 3px 16px rgba(0, 0, 0, 0.03);">
			<div style="
									background-color: {primary_color};
									color: white;
									font-size: 28px;
									font-weight: 300;
									text-align: center;
									width: 100%;">
				<div style="padding: 20px;">{event_name}</div></div>
			<div style="
									padding: 8%;">
				<div style="text-align: left;">Hello {first_name},</div>
				<br>
				<div style="text-align: left;">This email is to remind you that {event_name} starts tomorrow {start_date}.</div>
				<br>
				<div style="text-align: left;">A few minutes before the event begins, please click the following button to join.</div>
				<br>
				<div contenteditable="false" style="text-align: left;"><a href="{event_link}"><button style="
					font-family: Helvetica, Arial, sans-serif;
					font-weight: bold;
					font-size: 20;
					color: white;
					background-color: {primary_color};
					padding: 16px;
					border-width: 2px;
					border-radius: 6px;
					border-color: {primary_color};
					border-style: solid;
					height: min-content;
					cursor: pointer;
					text-align: left;">Join Now</button></a></div>
				<br>
				<div style="text-align: left, font-size: 10px;">Or click {event_link}</div>
				<div style="text-align: left;
										color: grey;
										font-size: 15px;
										margin-left: 20px;">*Please note, this unique link is your ticket to the event and shouldn't be shared with others.</div>
				<br>
				<div style="text-align: left;">Thank you.</div></div></div></div></div>
  `,
};

export const reminderOneHour = {
  status: statusOptions.ACTIVE,
  subject: "Reminder: {event_name} in One Hour",
  recipients: recipientsOptions.ALL_REGISTRANTS,
  minutesFromEvent: -60, // 1 hour before event start
  html: `
  <div style="
  background-color: #EFEFEF;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  font-family: Roboto, Helvetica, Ariel, sans-serif;
  font-weight: 400;
  box-sizing: border-box;
  font-size: 18px;">
<div style="
    max-width: 800px;
    margin: 0 auto;">
<div style="
      background-color: white;
      box-sizing: border-box;
      margin: 50px 20px;
      border-style: solid;
      border-width: 1px;
      border: #f1f1f2;
      box-shadow: 0px 3px 16px rgba(0, 0, 0, 0.03);">
<div style="
        background-color: {primary_color};
        color: white;
        font-size: 28px;
        font-weight: 300;
        text-align: center;
        width: 100%;">
<div style="padding: 20px;">{event_name}</div></div>
<div style="
        padding: 8%;">
<div style="text-align: left;">Hello {first_name},</div>
<br>
<div style="text-align: left;">This email is to remind you that {event_name} starts in one hour {start_date}.</div>
<br>
<div style="text-align: left;">A few minutes before the event begins, please click the following button to join.</div>
<br>
<div contenteditable="false" style="text-align: left;"><a href="{event_link}"><button style="
font-family: Helvetica, Arial, sans-serif;
font-weight: bold;
font-size: 20;
color: white;
background-color: {primary_color};
padding: 16px;
border-width: 2px;
border-radius: 6px;
border-color: {primary_color};
border-style: solid;
height: min-content;
cursor: pointer;
text-align: left;">Join Now</button></a></div>
<br>
<div style="text-align: left, font-size: 10px;">Or click {event_link}</div>
<div style="text-align: left;
          color: grey;
          font-size: 15px;
          margin-left: 20px;">*Please note, this unique link is your ticket to the event and shouldn't be shared with others.</div>
<br>
<div style="text-align: left;">Thank you.</div></div></div></div></div>
  `,
};

export const followUp = {
  status: statusOptions.DRAFT,
  subject: "Thank You for Attending {event_name}",
  recipients: recipientsOptions.ALL_REGISTRANTS,
  minutesFromEvent: 1440, // 24 hours after event start
  html: `
  <div style="
  background-color: #EFEFEF;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  font-family: Roboto, Helvetica, Ariel, sans-serif;
  font-weight: 400;
  box-sizing: border-box;
  font-size: 18px;">
<div style="
    max-width: 800px;
    margin: 0 auto;">
<div style="
      background-color: white;
      box-sizing: border-box;
      margin: 50px 20px;
      border-style: solid;
      border-width: 1px;
      border: #f1f1f2;
      box-shadow: 0px 3px 16px rgba(0, 0, 0, 0.03);">
<div style="
        background-color: {primary_color};
        color: white;
        font-size: 28px;
        font-weight: 300;
        text-align: center;
        width: 100%;">
<div style="padding: 20px;">{event_name}</div></div>
<div style="
        padding: 8%;">
<div style="text-align: left;">Hello {first_name},</div>
<br>
<div style="text-align: left;">Thank you for attending {event_name} yesterday.</div>
<br>
<div style="text-align: left;">If you were unable to attend or would like to see the event again, you can view the recording at {event_link}</div>
<br>
<div style="text-align: left;">Thank you.</div></div></div></div></div>
  `,
};
