import { DataTypes } from "sequelize";

export default (sequelize) => {
  return sequelize.define(
    "Pincode",
    {
      id: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      pincode: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
      city_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      is_serviceable: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      tableName: "pincodes",
      timestamps: false,
      indexes: [
        { unique: true, fields: ["pincode", "city_id"], name: "uq_pincode_city" },
        { fields: ["pincode"], name: "idx_pincode" },
      ],
    }
  );
};