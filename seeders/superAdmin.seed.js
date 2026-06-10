const bcrypt = require("bcryptjs");
const db = require("../models");

const seedUsers = async () => {
  try {
    const { User, Company } = db;

    const [company] = await Company.findOrCreate({
      where: { id: 1 },
      defaults: {
        id: 1,
        name: "Default Company",
        plan: "free",
        isActive: true,
      },
    });

    const users = [
      {
        fullName: "Super Admin",
        email: "superadmin@crm.com",
        password: "super123",
        role: "super_admin",
      },
      {
        fullName: "Admin User",
        email: "admin@crm.com",
        password: "admin123",
        role: "admin",
      },
      {
        fullName: "Staff User",
        email: "staff@crm.com",
        password: "staff123",
        role: "staff",
      },
      {
        fullName: "Observer Admin",
        email: "observer@crm.com",
        password: "observer123",
        role: "observer_admin",
      },
    ];

    for (const userData of users) {
      const existing = await User.findOne({
        where: { email: userData.email },
      });

      if (!existing) {
        const hashedPassword = await bcrypt.hash(
          userData.password,
          10
        );

        await User.create({
          fullName: userData.fullName,
          email: userData.email,
          password: hashedPassword,
          role: userData.role,
          companyId: company.id,
        });

        console.log(`✅ Created ${userData.role}`);
      }
    }

    console.log("🚀 User seeding complete");
  } catch (error) {
    console.error("❌ User seeding failed:", error);
  }
};

module.exports = seedUsers;