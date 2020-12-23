const recipientsOptions = {
  NEW_REGISTRANTS: "New Registrants",
  EMAIL_LIST: "Email List",
  ALL_REGISTRANTS: "All Registrants",
};

const requiresScheduledSend = [
  recipientsOptions.EMAIL_LIST,
  recipientsOptions.ALL_REGISTRANTS,
];

const statusOptions = {
  DRAFT: "Draft",
  DELETED: "Deleted",
  LIVE: "Live",
  ACTIVE: "Active",
  DISABLED: "Disabled",
  COMPLETE: "Complete",
};

const emailVariableNames = [
  "event_name",
  "time_zone",
  "event_link",
  "start_date",
  "end_date",
  "first_name",
  "last_name",
  "guest_email",
];

exports.recipientsOptions = recipientsOptions;
exports.statusOptions = statusOptions;
