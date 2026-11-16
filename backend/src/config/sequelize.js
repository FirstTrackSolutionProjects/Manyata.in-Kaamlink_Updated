import { Sequelize } from "sequelize";

export const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 3306,
    dialect: "mysql",
    logging: process.env.NODE_ENV === "development" ? console.log : false,
    define: {
      underscored: true,
      freezeTableName: true,
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
    pool: { max: 10, min: 0, idle: 10000 },
  }
);

export async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log("✅ Sequelize connected to MySQL");
  } catch (err) {
    console.error("❌ Unable to connect to MySQL:", err.message);
    process.exit(1);
  }
}