const SequelizeRedis = require("sequelize-redis");
const redis = require("redis");
const bluebird = require("bluebird");
const keys = require("../config/keys");

// Let's promisify Redis
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

const redisClient = redis.createClient(keys.redisUrl);

// Let's start
const sequelizeRedis = new SequelizeRedis(redisClient);
console.log("********* NEW CLIENT CREATEDDD ***********");

const clearCache = (key) => {
  redisClient.del(key);
  console.log("deleted");
};

module.exports = { sequelizeRedis, clearCache };
