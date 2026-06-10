const generateSalesBrain = (customers = []) => {
  const scored = customers.map((c) => {
    let score = 0;

    // Lead = low intent, but potential
    if (c.status === "lead") score += 40;

    // Active = high value
    if (c.status === "active") score += 80;

    // Inactive = risk
    if (c.status === "inactive") score += 10;

    // Email exists = more qualified
    if (c.email) score += 10;

    // Phone exists = reachable
    if (c.phone) score += 10;

    return {
      ...c.dataValues,
      score,
    };
  });

  // Sort highest priority first
  const sorted = scored.sort((a, b) => b.score - a.score);

  const topLeads = sorted.filter((c) => c.status === "lead").slice(0, 3);
  const hotCustomers = sorted.filter((c) => c.status === "active").slice(0, 3);
  const coldCustomers = sorted.filter((c) => c.status === "inactive");

  return {
    total: customers.length,
    topLeads,
    hotCustomers,
    coldCustomers,
    priorityList: sorted.slice(0, 5),
  };
};

module.exports = generateSalesBrain;