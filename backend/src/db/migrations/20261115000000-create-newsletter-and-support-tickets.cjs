"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const { DataTypes } = Sequelize;

    await queryInterface.createTable("newsletter_subscriptions", {
      id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
      email: { type: DataTypes.STRING(180), allowNull: false, unique: true },
      is_active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
      created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.literal("CURRENT_TIMESTAMP") },
    });

    await queryInterface.createTable("support_tickets", {
      id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
      ticket_ref: { type: DataTypes.STRING(24), allowNull: false, unique: true },
      booking_reference: { type: DataTypes.STRING(80), allowNull: true },
      category: { type: DataTypes.STRING(120), allowNull: true },
      description: { type: DataTypes.TEXT, allowNull: false },
      status: { type: DataTypes.ENUM("new", "in_progress", "resolved", "closed"), allowNull: false, defaultValue: "new" },
      created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.literal("CURRENT_TIMESTAMP") },
      updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.literal("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP") },
    });
    await queryInterface.addIndex("support_tickets", ["status", "created_at"], { name: "idx_support_ticket_status_created" });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("support_tickets");
    await queryInterface.dropTable("newsletter_subscriptions");
  },
};
