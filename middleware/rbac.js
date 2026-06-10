const permissions = require("../utils/permissions");

const rbac = (action) => {
  return (req, res, next) => {
    try {
      // =========================
      // 1. ENSURE USER EXISTS
      // =========================
      if (!req.user || !req.user.role) {
        return res.status(401).json({
          message: "Unauthorized (no user context)",
        });
      }

      const role = req.user.role;

      // =========================
      // 🔍 DEBUG LOGS (TEMPORARY)
      // =========================
      console.log("USER ROLE:", role);
      console.log("ACTION:", action);
      console.log("ALLOWED:", permissions[role]);

      // =========================
      // 2. GET ROLE PERMISSIONS
      // =========================
      const rolePermissions = permissions[role];

      if (!rolePermissions) {
        return res.status(403).json({
          message: `Role '${role}' has no permissions defined`,
        });
      }

      // =========================
      // 3. CHECK ACTION
      // =========================
      const allowed = rolePermissions.includes(action);

      if (!allowed) {
        return res.status(403).json({
          message: `Access denied: ${role} cannot perform ${action}`,
        });
      }

      next();
    } catch (error) {
      console.error("RBAC Error:", error);

      return res.status(500).json({
        message: "RBAC middleware error",
      });
    }
  };
};

module.exports = rbac;