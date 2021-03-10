const redisAdapter = require("socket.io-redis");
const redis = require("redis");

const keys = require("../config/keys");

const pubClient = redis.createClient(keys.redisUrl);
const subClient = pubClient.duplicate();

console.log("socket client created");

module.exports = redisAdapter({ pubClient, subClient });
