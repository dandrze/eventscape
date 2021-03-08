const sequelize = require("../sequelize");
const { Sequelize } = sequelize;

const PollResponse = sequelize.define("PollResponse", {});

module.exports = PollResponse;
