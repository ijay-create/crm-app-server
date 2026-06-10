const notify = (io, message, extra = {}) => {
  // Safety check so it never crashes server
  if (!io || typeof io.emit !== "function") {
    console.warn("Socket.IO not available for notification");
    return;
  }

  io.emit("notification", {
    message,
    time: new Date(),
    ...extra,
  });
};

module.exports = notify;