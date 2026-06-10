const redis = require("../config/redis");

const cache = (key) => {
  return async (req, res, next) => {
    try {
      if (!redis || typeof redis.get !== "function") {
        return next();
      }

      const cachedData = await redis.get(key);

      if (cachedData) {
        return res.json(JSON.parse(cachedData));
      }

      next();
    } catch (err) {
      console.log("Cache middleware error:", err.message);
      next(); // NEVER break request
    }
  };
};

module.exports = cache;