import { DataTypes } from "sequelize";

export default (sequelize) => sequelize.define("NewsletterSubscription", {
  id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
  email: { type: DataTypes.STRING(180), allowNull: false, unique: true },
  is_active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
}, {
  tableName: "newsletter_subscriptions",
  timestamps: true,
  createdAt: "created_at",
  updatedAt: false,
});
