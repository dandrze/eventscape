const SequelizeRedis = require("sequelize-redis");
const redisClient = require("./redis");

const sequelizeRedis = new SequelizeRedis(redisClient);

const clearCache = (key) => {
  redisClient.del(key);
  console.log("deleted");
};

module.exports = { sequelizeRedis, clearCache };
