import { DataTypes } from "sequelize";

export default (sequelize) => {
  return sequelize.define(
    "ServiceCategory",
    {
      id: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(80),
        allowNull: false,
        unique: true,
      },
      slug: {
        type: DataTypes.STRING(120),
        allowNull: false,
        unique: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      icon_key: {
        type: DataTypes.STRING(60),
        allowNull: true,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      tableName: "service_categories",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: false,
    }
  );
};