const Message = require("../models/Message");
const logActivity = require("../utils/logActivity");

const sendMessage = async (req, res) => {
  try {
    const { receiverId, content } = req.body;

    const message = await Message.create({
      senderId: req.user.id,
      receiverId,
      content,
      companyId: req.user.companyId, // ✅ IMPORTANT FIX
    });

    // 🔔 Activity log
    await logActivity({
      action: "SEND_MESSAGE",
      entity: "Message",
      entityId: message.id,
      user: req.user?.fullName || "System",
    });

    // 🔥 Real-time emit (safe)
    const io = req.app.get("io");

    if (io) {
      io.emit("newMessage", message);
    }

    res.status(201).json(message);
  } catch (error) {
    console.error("Send Message Error:", error);

    res.status(500).json({
      message: "Message failed",
    });
  }
};

const getMessages = async (req, res) => {
  try {
    const messages = await Message.findAll({
      where: {
        receiverId: req.user.id,
        companyId: req.user.companyId, // ✅ IMPORTANT FIX
      },
      order: [["createdAt", "DESC"]],
    });

    res.json(messages);
  } catch (error) {
    console.error("Get Messages Error:", error);

    res.status(500).json({
      message: "Error fetching messages",
    });
  }
};

module.exports = {
  sendMessage,
  getMessages,
};