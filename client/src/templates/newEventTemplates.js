import {
  logoHeaderModel,
  logoHeaderRightModel,
  heroBannerModel,
  heroBannerModelNarrow,
  registrationFormDescription,
  simpleTitle,
  streamChatReact,
  blankModel,
  registrationFormReact,
  logoTitleHeaderModel,
  spacer,
} from "./designBlockModels";
import {
  invitation,
  registrationConfirmation,
  reminderOneDay,
  reminderOneHour,
  followUp,
} from "./emailTemplates";

export const regPageModelTemplate = ({
  title,
  startDate,
  endDate,
  timeZone,
  description,
  logo,
}) => {
  return [
    { html: logoHeaderModel(logo), name: "banner" },
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

export const eventPageModelTemplate = ({
  title,

  logo,
}) => {
  return [
    {
      html: spacer(50),
      name: "spacer",
    },
    {
      html: logoTitleHeaderModel(logo, title),
      name: "title",
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
