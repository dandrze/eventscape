const redisAdapter = require("socket.io-redis");
const redis = require("redis");

const keys = require("../config/keys");

var pubClient;

if (process.env.NODE_ENV === "production") {
  pubClient = redis.createClient(keys.redisUrl, {
    tls: {
      rejectUnauthorized: false,
    },
  });
} else {
  pubClient = redis.createClient(keys.redisUrl);
}
const subClient = pubClient.duplicate();

module.exports = redisAdapter({ pubClient, subClient });
