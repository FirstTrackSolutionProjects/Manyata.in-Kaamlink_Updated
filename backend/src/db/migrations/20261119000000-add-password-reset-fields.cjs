"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const { DataTypes } = Sequelize;
    await queryInterface.addColumn("users", "password_reset_token_hash", {
      type: DataTypes.STRING(64),
      allowNull: true,
      unique: true,
    });
    await queryInterface.addColumn("users", "password_reset_expires_at", {
      type: DataTypes.DATE,
      allowNull: true,
    });
  },
  async down(queryInterface) {
    await queryInterface.removeColumn("users", "password_reset_expires_at");
    await queryInterface.removeColumn("users", "password_reset_token_hash");
  },
};
