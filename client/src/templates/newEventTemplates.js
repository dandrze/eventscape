import {
  registrationFormDescription,
  streamChatReact,
  registrationFormReact,
  logoTitleHeaderModel,
  spacer,
} from "./designBlockModels";
import {
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
    {
      html: logoTitleHeaderModel(logo, title),
      name: "title",
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
      html: logoTitleHeaderModel(logo, title),
      name: "title",
    },
    {
      html: null,
      name: "streamChat",
      isReact: true,
      reactComponent: streamChatReact,
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
