const { createClient } = require("redis");

let client = null;

const isProd = process.env.NODE_ENV === "production";

if (isProd && process.env.REDIS_URL) {
  client = createClient({
    url: process.env.REDIS_URL,
  });

  client.on("error", (err) => {
    console.log("⚠️ Redis error:", err.message);
  });

  client.connect().catch((err) => {
    console.log("⚠️ Redis connection failed, continuing without cache");
  });
} else {
  console.log("⚠️ Redis disabled (no REDIS_URL or not production)");
}

module.exports = client;