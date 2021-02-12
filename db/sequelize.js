const Sequelize = require("sequelize");
var logging
if(process.env.NODE_ENV === "development"){
  logging = console.log()
} else {
  logging = false
}
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  logging,
});

module.exports = sequelize;
