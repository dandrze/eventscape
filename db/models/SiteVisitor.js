const sequelize = require("../sequelize");
const { Sequelize } = sequelize;

const SiteVisitor = sequelize.define("SiteVisitor", {
  name: Sequelize.TEXT,
  uuid: Sequelize.TEXT,
});

module.exports = SiteVisitor;
