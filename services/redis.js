const SequelizeRedis = require("sequelize-redis");
const redis = require("redis");
const bluebird = require("bluebird");

// Let's promisify Redis
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

const redisUrl = "redis://127.0.0.1:6379";
const redisClient = redis.createClient(redisUrl);

// Let's start
const sequelizeRedis = new SequelizeRedis(redisClient);

const clearCache = (key) => {
  redisClient.del(key);
  console.log("deleted");
};

module.exports = { sequelizeRedis, clearCache };
