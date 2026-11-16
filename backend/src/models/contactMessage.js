import { DataTypes } from "sequelize";

export default (sequelize) => {
  const ContactMessage = sequelize.define("ContactMessage", {
    id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING(120), allowNull: false },
    email: { type: DataTypes.STRING(180), allowNull: false },
    phone: { type: DataTypes.STRING(15), allowNull: true },
    subject: { type: DataTypes.STRING(200), allowNull: true },
    message: { type: DataTypes.TEXT, allowNull: false },
    status: { type: DataTypes.ENUM("new", "read", "replied", "archived"), defaultValue: "new" },
  }, {
    tableName: "contact_messages",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
  });
  return ContactMessage;
};