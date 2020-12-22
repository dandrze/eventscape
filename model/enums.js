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
};

exports.recipientsOptions = recipientsOptions;
exports.statusOptions = statusOptions;
