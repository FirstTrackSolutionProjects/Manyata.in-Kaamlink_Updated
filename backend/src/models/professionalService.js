import { DataTypes } from "sequelize";

export default (sequelize) => {
  return sequelize.define(
    "ProfessionalService",
    {
      professional_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
      },
      category_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
      },
    },
    {
      tableName: "professional_services",
      timestamps: false,
    }
  );
};