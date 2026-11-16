import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Booking = sequelize.define("Booking", {
    id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
    user_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
    service_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
    professional_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: true },
    address_line: { type: DataTypes.STRING(255), allowNull: false },
    pincode: { type: DataTypes.STRING(10), allowNull: false },
    city_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
    slot_start: { type: DataTypes.DATE, allowNull: false },
    slot_end: { type: DataTypes.DATE, allowNull: false },
    status: { 
      type: DataTypes.ENUM('pending','confirmed','assigned','in_progress','completed','cancelled','refunded'), 
      defaultValue: 'pending' 
    },
    amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    payment_status: { type: DataTypes.ENUM('unpaid','paid','refunded'), defaultValue: 'unpaid' },
    notes: { type: DataTypes.TEXT, allowNull: true },
  }, {
    tableName: "bookings",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  });

  return Booking;
};