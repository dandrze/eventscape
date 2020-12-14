import {
  logoHeaderModel,
  logoHeaderRightModel,
  heroBannerModel,
  registrationFormDescription,
  titleTimeModel,
  streamChatReact,
  blankModel,
  registrationFormReact,
} from "./designBlockModels";
import { registrationConfirmation } from "./emailTemplates";

export const regPageModelTemplate = (title) => {
  return [
    { html: logoHeaderModel(), name: "banner" },
    {
      html: heroBannerModel(title),
      name: "heroBanner",
    },
    {
      html: registrationFormDescription(),
      name: "registration",
      is_react: true,
      react_component: registrationFormReact,
    },
  ];
};

export const eventPageModelTemplate = (title, startDate, endDate) => {
  return [
    {
      html: logoHeaderRightModel(),
      name: "bannerRight",
    },
    {
      html: titleTimeModel(title, startDate, endDate),
      name: "titleTime",
    },
    {
      html: null,
      name: "streamChat",
      is_react: true,
      react_component: streamChatReact,
    },
    {
      html: blankModel(),
      name: "blankModel",
    },
  ];
};

export const emaillistTemplate = (eventStartDate) => {
  return [
    {
      subject: "You are Invited To {Event_Name}",
      recipients: "All Registrants",
      send_date: eventStartDate,
      html: registrationConfirmation,
    },
    {
      subject: "Thank You for Registering for {Event_Name}",
      recipients: "New Registrants",
      send_on_registration: true,
      html: registrationConfirmation,
    },
    {
      subject: "Reminder: {Event_Name} Tomorrow",
      recipients: "All Registrants",
      send_date: eventStartDate,
      html: registrationConfirmation,
    },
    {
      subject: "Reminder: {Event_Name} in One Hour",
      recipients: "All Registrants",
      send_date: eventStartDate,
      html: registrationConfirmation,
    },
    {
      subject: "Thank You for Attending {Event_Name}",
      recipients: "All Registrants",
      send_date: eventStartDate,
      html: registrationConfirmation,
    },
  ];
};
