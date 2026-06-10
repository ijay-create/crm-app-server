const triggerWebhook = async (req, res) => {
  try {
    console.log("Webhook event:", req.body);

    res.json({ received: true });

  } catch (error) {
    res.status(500).json({
      message: "Webhook failed",
    });
  }
};

module.exports = { triggerWebhook };