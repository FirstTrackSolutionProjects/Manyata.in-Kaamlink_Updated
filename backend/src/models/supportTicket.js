import { DataTypes } from "sequelize";

export default (sequelize) => sequelize.define("SupportTicket", {
  id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
  ticket_ref: { type: DataTypes.STRING(24), allowNull: false, unique: true },
  booking_reference: { type: DataTypes.STRING(80), allowNull: true },
  category: { type: DataTypes.STRING(120), allowNull: true },
  description: { type: DataTypes.TEXT, allowNull: false },
  status: { type: DataTypes.ENUM("new", "in_progress", "resolved", "closed"), allowNull: false, defaultValue: "new" },
  deleted_at: { type: DataTypes.DATE, allowNull: true },
}, {
  tableName: "support_tickets",
  timestamps: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
});
