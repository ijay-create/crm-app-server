const calculateLeadScore = (customer) => {
  let score = 0;

  if (customer.status === "active") score += 50;
  if (customer.status === "lead") score += 20;
  if (customer.company) score += 10;
  if (customer.email?.includes("@gmail")) score += 5;

  if (customer.phone) score += 10;

  return score;
};

module.exports = calculateLeadScore;