"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("customer_profile_photos", "image_data", {
      type: Sequelize.BLOB("medium"),
      allowNull: true,
    });
    await queryInterface.addColumn("customer_profile_photos", "object_key", {
      type: Sequelize.STRING(512),
      allowNull: true,
    });
  },
  async down(queryInterface, Sequelize) {
    const [rows] = await queryInterface.sequelize.query(
      "SELECT COUNT(*) AS count FROM customer_profile_photos WHERE object_key IS NOT NULL",
    );
    if (Number(rows[0]?.count || 0) > 0) {
      throw new Error("Cannot roll back while profile photos are stored in S3. Migrate them back to image_data first.");
    }
    await queryInterface.removeColumn("customer_profile_photos", "object_key");
    await queryInterface.changeColumn("customer_profile_photos", "image_data", {
      type: Sequelize.BLOB("medium"),
      allowNull: false,
    });
  },
};
