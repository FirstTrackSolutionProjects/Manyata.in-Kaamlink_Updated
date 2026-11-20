"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("users", "role", {
      type: Sequelize.ENUM("customer", "partner", "admin", "employee"),
      allowNull: false,
      defaultValue: "customer",
    });
    await queryInterface.addColumn("users", "admin_permissions", {
      type: Sequelize.JSON,
      allowNull: true,
    });
    await queryInterface.sequelize.query("UPDATE users SET admin_permissions = JSON_ARRAY() WHERE admin_permissions IS NULL");
    await queryInterface.changeColumn("users", "admin_permissions", { type: Sequelize.JSON, allowNull: false });
  },

  async down(queryInterface, Sequelize) {
    const [rows] = await queryInterface.sequelize.query("SELECT COUNT(*) AS count FROM users WHERE role = 'employee'");
    if (Number(rows[0]?.count || 0) > 0) {
      throw new Error("Remove employee accounts before rolling back employee access control.");
    }
    await queryInterface.removeColumn("users", "admin_permissions");
    await queryInterface.changeColumn("users", "role", {
      type: Sequelize.ENUM("customer", "partner", "admin"),
      allowNull: false,
      defaultValue: "customer",
    });
  },
};
