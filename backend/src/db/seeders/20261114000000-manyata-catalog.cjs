"use strict";

const catalog = [
  ["Deep Cleaning", "deep-cleaning", "Complete home deep cleaning, including kitchens and bathrooms.", 499, 240],
  ["Pest Control", "pest-control", "Treatment for common household pests by trained professionals.", 599, 90],
  ["AC Repair & Service", "ac-repair-service", "AC servicing, repair and installation by skilled experts.", 399, 60],
  ["Plumbing", "plumbing", "Repairs for leaking taps, pipes and bathroom fittings.", 299, 45],
  ["Electrical", "electrical", "Home wiring, switchboard and electrical repair services.", 299, 45],
  ["Appliance Repair", "appliance-repair", "Home repairs for washing machines, fridges and appliances.", 349, 60],
  ["Painting", "painting", "Interior and exterior painting for your home.", 899, 480],
  ["Carpentry", "carpentry", "Furniture repairs, installations and custom woodwork.", 349, 60],
  ["Salon at Home", "salon-at-home", "Personal grooming and beauty services at home.", 449, 90],
  ["Packers & Movers", "packers-movers", "Home shifting within and across cities.", 1499, 240],
];

module.exports = {
  async up(queryInterface) {
    const slugs = catalog.map(([, slug]) => slug);
    const [existingCategories] = await queryInterface.sequelize.query(
      `SELECT id, slug FROM service_categories WHERE slug IN (${slugs.map(() => "?").join(",")})`,
      { replacements: slugs },
    );
    const knownCategories = new Map(existingCategories.map((row) => [row.slug, row.id]));
    const now = new Date();
    const missingCategories = catalog.filter(([, slug]) => !knownCategories.has(slug));
    if (missingCategories.length) {
      await queryInterface.bulkInsert("service_categories", missingCategories.map(([name, slug, description]) => ({
        name, slug, description, icon_key: slug, is_active: true, created_at: now,
      })));
    }

    const [allCategories] = await queryInterface.sequelize.query(
      `SELECT id, slug FROM service_categories WHERE slug IN (${slugs.map(() => "?").join(",")})`,
      { replacements: slugs },
    );
    const categoryIds = new Map(allCategories.map((row) => [row.slug, row.id]));
    const [existingServices] = await queryInterface.sequelize.query(
      `SELECT slug FROM services WHERE slug IN (${slugs.map(() => "?").join(",")})`,
      { replacements: slugs },
    );
    const knownServices = new Set(existingServices.map((row) => row.slug));
    const missingServices = catalog.filter(([, slug]) => !knownServices.has(slug));
    if (missingServices.length) {
      await queryInterface.bulkInsert("services", missingServices.map(([name, slug, description, price, duration]) => ({
        category_id: categoryIds.get(slug), name, slug, description,
        base_price: price, duration_mins: duration, is_active: true, created_at: now,
      })));
    }
  },

  async down(queryInterface) {
    const slugs = catalog.map(([, slug]) => slug);
    await queryInterface.bulkDelete("services", { slug: slugs });
    await queryInterface.bulkDelete("service_categories", { slug: slugs });
  },
};
