const conn = require("../conn");
const { Sequelize } = conn;

const SiteVisitor = conn.define("SiteVisitor", {
  name: Sequelize.TEXT,
  uuid: Sequelize.TEXT,
});

module.exports = SiteVisitor;
