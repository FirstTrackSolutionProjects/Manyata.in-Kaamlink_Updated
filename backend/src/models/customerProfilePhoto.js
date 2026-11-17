export default (sequelize, DataTypes) => sequelize.define("CustomerProfilePhoto", {
  user_id: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true },
  mime_type: { type: DataTypes.STRING(32), allowNull: false },
  image_data: { type: DataTypes.BLOB("medium"), allowNull: false },
}, { tableName: "customer_profile_photos", timestamps: false });
