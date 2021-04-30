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

export const regPageModelTemplate = (
  title,
  startDate,
  endDate,
  timeZone,
  description
) => {
  return [
    { html: logoHeaderModel(), name: "banner" },
    {
      html: heroBannerModel(title),
      name: "heroBanner",
    },
    {
      html: registrationFormDescription(
        startDate,
        endDate,
        timeZone,
        description
      ),
      name: "registration",
      isReact: true,
      reactComponent: registrationFormReact,
    },
  ];
};

export const eventPageModelTemplate = (title, startDate, endDate, timeZone) => {
  return [
    {
      html: logoHeaderRightModel(),
      name: "bannerRight",
    },
    {
      html: heroBannerModel(title),
      name: "heroBanner",
    },
    {
      html: null,
      name: "streamChat",
      isReact: true,
      reactComponent: streamChatReact,
    },
    {
      html: blankModel(),
      name: "blankModel",
    },
  ];
};

export const emaillistTemplate = (eventStartDate) => {
  return [
    //invitation,
    registrationConfirmation,
    reminderOneDay,
    reminderOneHour,
    followUp,
  ];
};
