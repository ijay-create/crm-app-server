const Company = require("../models/Company");

const subscriptionGuard = (requiredPlan) => {
  const order = {
    free: 0,
    pro: 1,
    enterprise: 2,
  };

  return async (req, res, next) => {
    const company = await Company.findByPk(req.user.companyId);

    if (!company) {
      return res.status(404).json({
        message: "Company not found",
      });
    }

    if (order[company.plan] < order[requiredPlan]) {
      return res.status(403).json({
        message: "Upgrade required",
      });
    }

    next();
  };
};

module.exports = subscriptionGuard;