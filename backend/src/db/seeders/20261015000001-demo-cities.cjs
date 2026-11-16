"use strict";

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert("cities", [
      { name: "Bengaluru", state: "Karnataka", is_active: true },
      { name: "Mumbai", state: "Maharashtra", is_active: true },
      { name: "Delhi NCR", state: "Delhi", is_active: true },
      { name: "Pune", state: "Maharashtra", is_active: true },
      { name: "Hyderabad", state: "Telangana", is_active: true },
      { name: "Chennai", state: "Tamil Nadu", is_active: true },
      { name: "Kolkata", state: "West Bengal", is_active: true },
      { name: "Ahmedabad", state: "Gujarat", is_active: true },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("cities", {
      name: ["Bengaluru", "Mumbai", "Delhi NCR", "Pune", "Hyderabad", "Chennai", "Kolkata", "Ahmedabad"],
    });
  },
};
