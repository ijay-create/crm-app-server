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
  console.log("⚠️ Redis disabled (safe mode)");
}

/* =========================
   SAFE WRAPPER (IMPORTANT)
========================= */

const safeRedis = {
  get: async (key) => {
    if (!client) return null;
    return await client.get(key);
  },

  set: async (key, value, options) => {
    if (!client) return null;
    return await client.set(key, value, options);
  },

  del: async (key) => {
    if (!client) return null;
    return await client.del(key);
  },
};

module.exports = safeRedis;