"use strict";

module.exports = {
  async up(queryInterface) {
    const indexes = await queryInterface.showIndex("users");
    const phoneUniqueIndexes = indexes.filter((index) =>
      index.unique &&
      index.fields?.length === 1 &&
      (index.fields[0].attribute || index.fields[0].name) === "phone"
    );

    for (const index of phoneUniqueIndexes) {
      await queryInterface.removeIndex("users", index.name);
    }
  },

  async down(queryInterface) {
    await queryInterface.addIndex("users", ["phone"], {
      unique: true,
      name: "users_phone_unique",
    });
  },
};
