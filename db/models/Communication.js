const sequelize = require("../sequelize");
const { Sequelize } = sequelize;

const Communication = sequelize.define("Communication", {
  subject: Sequelize.TEXT,
  recipients: Sequelize.TEXT,
  status: {
    type: Sequelize.TEXT,
    defaultValue: "Draft",
  },
  html: Sequelize.TEXT,
  minutesFromEvent: Sequelize.INTEGER,
  fromName: Sequelize.TEXT,
  nextInvocation: Sequelize.DATE,
  triggeredJobs: Sequelize.TEXT,
  replyTo: Sequelize.TEXT,
  successfulSends: Sequelize.INTEGER,
  failedSends: Sequelize.INTEGER,
});

module.exports = Communication;
