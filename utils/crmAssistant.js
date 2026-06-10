const calculateInsight = (customers) => {
  const total = customers.length;

  const active = customers.filter(c => c.status === "active").length;
  const leads = customers.filter(c => c.status === "lead").length;

  let insight = "";

  if (leads > active) {
    insight = "You have more leads than active customers. Focus on conversion.";
  }

  if (active > leads) {
    insight = "Your pipeline is healthy with strong active customer base.";
  }

  if (total > 100) {
    insight += " Your CRM is scaling well.";
  }

  return {
    total,
    active,
    leads,
    insight,
  };
};

module.exports = calculateInsight;