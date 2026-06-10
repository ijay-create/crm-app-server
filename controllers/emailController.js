const sendCampaign = async (req, res) => {
  try {
    const { subject, message } = req.body;

    // Simulated email sending
    console.log("EMAIL CAMPAIGN SENT");
    console.log(subject, message);

    req.app.get("io").emit("notification", {
      message: `Email campaign sent: ${subject}`,
    });

    res.json({
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: "Email failed",
    });
  }
};

module.exports = { sendCampaign };