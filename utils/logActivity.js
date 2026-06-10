const ActivityLog = require("../models/ActivityLog");

const logActivity = async ({
  action,
  entity,
  entityId,
  user,
}) => {
  await ActivityLog.create({
    action,
    entity,
    entityId,
    user,
  });
};

module.exports = logActivity;