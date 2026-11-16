"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const { DataTypes } = Sequelize;

    // ---- users ----
    await queryInterface.createTable("users", {
      id: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      full_name: { type: DataTypes.STRING(120), allowNull: false },
      email: { type: DataTypes.STRING(180), allowNull: false, unique: true },
      phone: { type: DataTypes.STRING(15), allowNull: true, unique: true },
      password_hash: { type: DataTypes.STRING(255), allowNull: true },
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
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal(
          "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
        ),
      },
    });

    // ---- cities ----
    await queryInterface.createTable("cities", {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      name: { type: DataTypes.STRING(80), allowNull: false, unique: true },
      state: { type: DataTypes.STRING(80), allowNull: false },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });

    // ---- pincodes ----
    await queryInterface.createTable("pincodes", {
      id: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      pincode: { type: DataTypes.STRING(10), allowNull: false },
      city_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: "cities", key: "id" },
        onDelete: "CASCADE",
      },
      is_serviceable: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    });
    await queryInterface.addIndex("pincodes", ["pincode", "city_id"], {
      unique: true,
      name: "uq_pincode_city",
    });
    await queryInterface.addIndex("pincodes", ["pincode"], {
      name: "idx_pincode",
    });

    // ---- service_categories ----
    await queryInterface.createTable("service_categories", {
      id: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      name: { type: DataTypes.STRING(80), allowNull: false, unique: true },
      slug: { type: DataTypes.STRING(120), allowNull: false, unique: true },
      description: { type: DataTypes.TEXT, allowNull: true },
      icon_key: { type: DataTypes.STRING(60), allowNull: true },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });

    // ---- services ----
    await queryInterface.createTable("services", {
      id: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      category_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        references: { model: "service_categories", key: "id" },
        onDelete: "CASCADE",
      },
      name: { type: DataTypes.STRING(150), allowNull: false, unique: true },
      slug: { type: DataTypes.STRING(150), allowNull: false, unique: true },
      description: { type: DataTypes.TEXT, allowNull: true },
      base_price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
      duration_mins: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
    await queryInterface.addIndex("services", ["category_id"], {
      name: "idx_services_category",
    });

    // ---- professionals ----
    await queryInterface.createTable("professionals", {
      id: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        unique: true,
        references: { model: "users", key: "id" },
        onDelete: "CASCADE",
      },
      city_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
        references: { model: "cities", key: "id" },
        onDelete: "SET NULL",
      },
      bio: { type: DataTypes.TEXT, allowNull: true },
      experience_years: {
        type: DataTypes.TINYINT.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
      },
      rating_avg: {
        type: DataTypes.DECIMAL(3, 2),
        allowNull: false,
        defaultValue: 0,
      },
      rating_count: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
      },
      verification_status: {
        type: DataTypes.ENUM("pending", "verified", "rejected"),
        allowNull: false,
        defaultValue: "pending",
      },
      is_available: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
    await queryInterface.addIndex("professionals", ["city_id"], {
      name: "idx_pro_city",
    });
    await queryInterface.addIndex("professionals", ["verification_status"], {
      name: "idx_pro_status",
    });

    // ---- professional_services ----
    await queryInterface.createTable("professional_services", {
      professional_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        references: { model: "professionals", key: "id" },
        onDelete: "CASCADE",
      },
      category_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        references: { model: "service_categories", key: "id" },
        onDelete: "CASCADE",
      },
    });

    // ---- refresh_tokens ----
    await queryInterface.createTable("refresh_tokens", {
      id: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        references: { model: "users", key: "id" },
        onDelete: "CASCADE",
      },
      token_hash: { type: DataTypes.STRING(255), allowNull: false },
      revoked: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
    await queryInterface.addIndex("refresh_tokens", ["user_id"], {
      name: "idx_rt_user",
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("refresh_tokens");
    await queryInterface.dropTable("professional_services");
    await queryInterface.dropTable("professionals");
    await queryInterface.dropTable("services");
    await queryInterface.dropTable("service_categories");
    await queryInterface.dropTable("pincodes");
    await queryInterface.dropTable("cities");
    await queryInterface.dropTable("users");
  },
};