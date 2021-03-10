const redis = require("redis");
const bluebird = require("bluebird");

const keys = require("../config/keys");

// Let's promisify Redis
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

const redisClient = redis.createClient(keys.redisUrl);
console.log("seq client created");

module.exports = redisClient;
