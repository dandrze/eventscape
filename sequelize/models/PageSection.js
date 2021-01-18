const sequelize = require("../sequelize");
const { Sequelize } = sequelize;

const PageSection = sequelize.define("PageSection", {
  index: Sequelize.INTEGER,
  html: Sequelize.TEXT,
  isReact: Sequelize.BOOLEAN,
  reactComponent: Sequelize.JSONB,
});

module.exports = PageSection;
