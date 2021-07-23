const Sequelize = require("sequelize");

var logging;
var sequelize;
if (process.env.NODE_ENV === "production") {
  logging = false;
  //logging = console.log;
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

// Heroku specific - if the app is in the production environment, leverage the connection pool available on the paid postgres instance
if (process.env.NODE_ENV === "production") {
  sequelize = new Sequelize(process.env.DATABASE_CONNECTION_POOL_URL, {
    dialectOptions,
    logging,
  });
} else {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialectOptions,
    logging,
  });
}

module.exports = sequelize;
