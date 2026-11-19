import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

const backendRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const configEnvFile = path.join(
  os.homedir(),
  "domains",
  "floralwhite-kingfisher-673920.hostingersite.com",
  "hbuilds",
  "config",
  ".env",
);

if (!existsSync(configEnvFile)) {
  console.error(`Hostinger app environment file is missing: ${configEnvFile}`);
  process.exit(1);
}

dotenv.config({ path: configEnvFile, override: false });

const requiredEnv = ["DB_HOST", "DB_NAME", "DB_USER", "DB_PASSWORD"];
const missingEnv = requiredEnv.filter((key) => !process.env[key]);
if (missingEnv.length > 0) {
  console.error(`Required database settings are missing: ${missingEnv.join(", ")}`);
  process.exit(1);
}

const action = process.argv[2] ?? "status";
const commandByAction = {
  status: "db:migrate:status",
  migrate: "db:migrate",
};

if (!Object.hasOwn(commandByAction, action)) {
  console.error("Usage: node src/scripts/hostinger-migrate.js [status|migrate]");
  process.exit(2);
}

const sequelizeCli = path.join(backendRoot, "node_modules", "sequelize-cli", "lib", "sequelize");
if (!existsSync(sequelizeCli)) {
  console.error("sequelize-cli is not installed in this deployed build. Deploy the latest backend first.");
  process.exit(1);
}

const result = spawnSync(
  process.execPath,
  [sequelizeCli, "--options-path", ".sequelizerc.cjs", commandByAction[action], "--env", "production"],
  { cwd: backendRoot, env: process.env, stdio: "inherit" },
);

if (result.error) {
  console.error(`Could not start Sequelize CLI: ${result.error.message}`);
  process.exit(1);
}

process.exit(result.status ?? 1);
