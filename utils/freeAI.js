const askFreeAI = async (prompt) => {
  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HF_TOKEN || ""}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: prompt,
        }),
      }
    );

    const data = await response.json();

    const aiText =
      data?.[0]?.generated_text ||
      data?.generated_text ||
      data?.error;

    if (!aiText || typeof aiText !== "string") {
      return "Focus on improving lead conversion and customer engagement.";
    }

    return aiText;
  } catch (error) {
    console.error("AI service error:", error);

    return "Focus on improving lead conversion and customer engagement.";
  }
};

module.exports = askFreeAI;