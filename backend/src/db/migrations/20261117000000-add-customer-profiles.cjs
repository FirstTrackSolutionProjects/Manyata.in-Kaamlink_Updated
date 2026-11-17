"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const { DataTypes } = Sequelize;
    await queryInterface.addColumn("users", "address_line", { type: DataTypes.STRING(255), allowNull: true });
    await queryInterface.addColumn("users", "city", { type: DataTypes.STRING(100), allowNull: true });
    await queryInterface.addColumn("users", "pincode", { type: DataTypes.STRING(10), allowNull: true });
    await queryInterface.addColumn("users", "deleted_at", { type: DataTypes.DATE, allowNull: true });
    await queryInterface.addIndex("users", ["role", "deleted_at"], { name: "idx_users_role_deleted_at" });
    await queryInterface.createTable("customer_profile_photos", {
      user_id: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true, references: { model: "users", key: "id" }, onDelete: "CASCADE" },
      mime_type: { type: DataTypes.STRING(32), allowNull: false },
      image_data: { type: DataTypes.BLOB("medium"), allowNull: false },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable("customer_profile_photos");
    await queryInterface.removeIndex("users", "idx_users_role_deleted_at");
    await queryInterface.removeColumn("users", "deleted_at");
    await queryInterface.removeColumn("users", "pincode");
    await queryInterface.removeColumn("users", "city");
    await queryInterface.removeColumn("users", "address_line");
  },
};
