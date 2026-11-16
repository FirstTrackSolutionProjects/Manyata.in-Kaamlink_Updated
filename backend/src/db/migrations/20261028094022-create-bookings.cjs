"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("bookings", {
      id: {
        type: Sequelize.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        references: { model: "users", key: "id" },
        onDelete: "CASCADE",
      },
      service_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        references: { model: "services", key: "id" },
        onDelete: "RESTRICT",
      },
      professional_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: true,
        references: { model: "professionals", key: "id" },
        onDelete: "SET NULL",
      },
      address_line: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      pincode: {
        type: Sequelize.STRING(10),
        allowNull: false,
      },
      city_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true,
        references: { model: "cities", key: "id" },
        onDelete: "SET NULL",
      },
      slot_start: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      slot_end: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('pending','confirmed','assigned','in_progress','completed','cancelled','refunded'),
        defaultValue: 'pending',
      },
      amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      payment_status: {
        type: Sequelize.ENUM('unpaid','paid','refunded'),
        defaultValue: 'unpaid',
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("bookings");
  }
};