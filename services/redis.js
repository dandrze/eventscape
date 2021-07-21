const redis = require("redis");
const bluebird = require("bluebird");

const keys = require("../config/keys");

// Let's promisify Redis
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

var redisClient;

if (process.env.NODE_ENV === "production") {
  redisClient = redis.createClient(keys.redisUrl, {
    tls: {
      rejectUnauthorized: false,
    },
  });
} else {
  redisClient = redis.createClient(keys.redisUrl);
}
module.exports = redisClient;
