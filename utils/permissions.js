const permissions = {
  super_admin: ["CREATE", "READ", "UPDATE", "DELETE"],

  // full admin access (typical SaaS expectation)
  admin: ["CREATE", "READ", "UPDATE", "DELETE"],

  // read-only observer role
  observer_admin: ["READ"],

  // staff can create + view + update (no delete for safety)
  staff: ["READ", "CREATE", "UPDATE"],
};

module.exports = permissions;