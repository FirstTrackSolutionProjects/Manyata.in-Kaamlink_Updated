"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const { DataTypes } = Sequelize;
    await queryInterface.addColumn("bookings", "payment_method", {
      type: DataTypes.ENUM("pay_after_service", "razorpay"),
      allowNull: false,
      defaultValue: "pay_after_service",
    });
    await queryInterface.addColumn("bookings", "gateway_order_id", {
      type: DataTypes.STRING(64),
      allowNull: true,
      unique: true,
    });
    await queryInterface.addColumn("bookings", "gateway_payment_id", {
      type: DataTypes.STRING(64),
      allowNull: true,
      unique: true,
    });
    await queryInterface.addColumn("bookings", "gateway_refund_id", {
      type: DataTypes.STRING(64),
      allowNull: true,
      unique: true,
    });
  },
  async down(queryInterface) {
    await queryInterface.removeColumn("bookings", "gateway_refund_id");
    await queryInterface.removeColumn("bookings", "gateway_payment_id");
    await queryInterface.removeColumn("bookings", "gateway_order_id");
    await queryInterface.removeColumn("bookings", "payment_method");
  },
};
