const generateSalesCopilot = (customers = []) => {
  const scored = customers.map((c) => {
    let score = 0;

    // Lead = opportunity
    if (c.status === "lead") score += 60;

    // Active = revenue already
    if (c.status === "active") score += 90;

    // Inactive = risk/opportunity to revive
    if (c.status === "inactive") score += 30;

    if (c.email) score += 10;
    if (c.phone) score += 10;

    return {
      ...c.dataValues,
      score,
    };
  });

  const sorted = scored.sort((a, b) => b.score - a.score);

  const toCallToday = sorted.slice(0, 3);

  const hotLeads = sorted.filter(c => c.status === "lead").slice(0, 3);
  const reviveTargets = sorted.filter(c => c.status === "inactive").slice(0, 3);

  return {
    total: customers.length,
    toCallToday,
    hotLeads,
    reviveTargets,
  };
};

module.exports = generateSalesCopilot;