const readOnlyGuard = (req, res, next) => {
  if (req.user?.role === "observer") {
    return res.status(403).json({
      message: "Read-only access",
    });
  }

  next();
};

module.exports = readOnlyGuard;