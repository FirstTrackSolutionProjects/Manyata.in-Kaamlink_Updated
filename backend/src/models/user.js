import { DataTypes } from "sequelize";

export default (sequelize) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      full_name: {
        type: DataTypes.STRING(120),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(180),
        allowNull: false,
        unique: true,
        validate: { isEmail: true },
      },
      phone: {
        type: DataTypes.STRING(15),
        allowNull: true,
        unique: true,
      },
      password_hash: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      auth_provider: {
        type: DataTypes.ENUM("local", "google"),
        allowNull: false,
        defaultValue: "local",
      },
      role: {
        type: DataTypes.ENUM("customer", "professional", "admin"),
        allowNull: false,
        defaultValue: "customer",
      },
      is_verified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      address_line: { type: DataTypes.STRING(255), allowNull: true },
      city: { type: DataTypes.STRING(100), allowNull: true },
      pincode: { type: DataTypes.STRING(10), allowNull: true },
      deleted_at: { type: DataTypes.DATE, allowNull: true },
    },
    {
      tableName: "users",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  return User;
};
