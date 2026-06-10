const generateInsights = (customers = []) => {
  const total = customers.length;

  const normalized = customers.map((c) => {
    const status = c.status || "unknown";

    let score = 0;

    if (status === "lead") score += 60;
    if (status === "active") score += 90;
    if (status === "inactive") score += 20;

    if (c.email) score += 10;
    if (c.phone) score += 10;

    return {
      id: c.id,
      fullName: c.fullName,
      email: c.email,
      phone: c.phone,
      status,
      score,
    };
  });

  const sorted = [...normalized].sort((a, b) => b.score - a.score);

  const leads = normalized.filter((c) => c.status === "lead").length;
  const active = normalized.filter((c) => c.status === "active").length;
  const inactive = normalized.filter((c) => c.status === "inactive").length;

  const topPriority = sorted.slice(0, 3);

  return {
    summary: {
      total,
      active,
      leads,
      inactive,
    },

    copilot: {
      topPriority,

      nextBestActions: [
        sorted[0] ? `Call ${sorted[0].fullName} today` : null,
        leads > 0 ? "Follow up all leads within 24 hours" : null,
        inactive > 0 ? "Re-engage inactive customers" : null,
      ].filter(Boolean),
    },
  };
};

module.exports = generateInsights;