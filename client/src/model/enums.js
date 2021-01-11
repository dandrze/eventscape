export const recipientsOptions = {
  NEW_REGISTRANTS: "New Registrants",
  EMAIL_LIST: "Email List",
  ALL_REGISTRANTS: "All Registrants",
};

export const requiresScheduledSend = [
  recipientsOptions.EMAIL_LIST,
  recipientsOptions.ALL_REGISTRANTS,
];

export const statusOptions = {
  DRAFT: "Draft",
  DELETED: "Deleted",
  LIVE: "Live",
  ACTIVE: "Active",
  DISABLED: "Disabled",
  COMPLETE: "Complete",
};

export const emailVariableNames = [
  "event_name",
  "time_zone",
  "event_link",
  "start_date",
  "end_date",
  "first_name",
  "last_name",
];

export const pageNames = { REGISTRATION: "registration", EVENT: "event" };
