"use strict";

module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(
      "ALTER TABLE `users` MODIFY `role` ENUM('customer', 'professional', 'partner', 'admin') NOT NULL DEFAULT 'customer'",
    );
    await queryInterface.sequelize.query(
      "UPDATE `users` SET `role` = 'partner' WHERE `role` = 'professional'",
    );
    await queryInterface.sequelize.query(
      "ALTER TABLE `users` MODIFY `role` ENUM('customer', 'partner', 'admin') NOT NULL DEFAULT 'customer'",
    );
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(
      "ALTER TABLE `users` MODIFY `role` ENUM('customer', 'professional', 'partner', 'admin') NOT NULL DEFAULT 'customer'",
    );
    await queryInterface.sequelize.query(
      "UPDATE `users` SET `role` = 'professional' WHERE `role` = 'partner'",
    );
    await queryInterface.sequelize.query(
      "ALTER TABLE `users` MODIFY `role` ENUM('customer', 'professional', 'admin') NOT NULL DEFAULT 'customer'",
    );
  },
};
