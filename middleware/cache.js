const client = require("../config/redis");

const cache = (key) => async (req, res, next) => {
  const data = await client.get(key);

  if (data) {
    return res.json(JSON.parse(data));
  }

  next();
};

module.exports = cache;