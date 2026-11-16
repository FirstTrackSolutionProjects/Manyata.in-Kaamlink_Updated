import { DataTypes } from "sequelize";

export default (sequelize) => {
  return sequelize.define(
    "City",
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(80),
        allowNull: false,
        unique: true,
      },
      state: {
        type: DataTypes.STRING(80),
        allowNull: false,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      tableName: "cities",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: false,
    }
  );
};