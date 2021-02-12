const Sequelize = require("sequelize");
var logging
if(process.env.NODE_ENV === "development"){
  logging = (...msg) => console.log(msg)
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
