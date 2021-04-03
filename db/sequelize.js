const Sequelize = require("sequelize");

var logging;
if (process.env.NODE_ENV === "production") {
  //logging = false;
  logging = console.log;
} else {
  logging = console.log;
}

// Allows for a local postgres db without ssl
const dialectOptions = process.env.IS_LOCAL
  ? {}
  : {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    };
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialectOptions,
  logging,
});

module.exports = sequelize;
