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
import {
  invitation,
  registrationConfirmation,
  reminderOneDay,
  reminderOneHour,
  followUp,
} from "./emailTemplates";

export const regPageModelTemplate = (title, startDate, endDate, timeZoneName) => {
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
    invitation,
    registrationConfirmation,
    reminderOneDay,
    reminderOneHour,
    followUp,
  ];
};
