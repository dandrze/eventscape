const sequelize = require("../sequelize");
const { Sequelize } = sequelize;

const PageModel = sequelize.define("PageModel", {
  type: Sequelize.TEXT,
});

module.exports = PageModel;
