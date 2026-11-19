"use strict";

const tables = [
  "bookings",
  "services",
  "service_categories",
  "cities",
  "pincodes",
  "contact_messages",
  "support_tickets",
  "newsletter_subscriptions",
];

module.exports = {
  async up(queryInterface, Sequelize) {
    for (const table of tables) {
      await queryInterface.addColumn(table, "deleted_at", { type: Sequelize.DATE, allowNull: true });
      await queryInterface.addIndex(table, ["deleted_at"], { name: `idx_${table}_deleted_at` });
    }
  },

  async down(queryInterface) {
    for (const table of [...tables].reverse()) {
      await queryInterface.removeIndex(table, `idx_${table}_deleted_at`);
      await queryInterface.removeColumn(table, "deleted_at");
    }
  },
};
