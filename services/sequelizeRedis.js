const SequelizeRedis = require("sequelize-redis");
const redisClient = require("./redis");

// Let's start
const sequelizeRedis = new SequelizeRedis(redisClient);

const clearCache = (key) => {
  redisClient.del(key);
  console.log("deleted");
};

module.exports = { sequelizeRedis, clearCache };
