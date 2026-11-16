import "dotenv/config";
import bcrypt from "bcryptjs";
import readline from "node:readline";
import { sequelize } from "../config/sequelize.js";
import { User } from "../models/index.js";

function ask(question, { hidden = false } = {}) {
  return new Promise((resolve) => {
    const terminal = process.stdin;
    const output = process.stdout;
    output.write(question);
    let value = "";
    readline.emitKeypressEvents(terminal);
    if (terminal.isTTY) terminal.setRawMode(true);
    const onKey = (character, key = {}) => {
      if (key.ctrl && key.name === "c") {
        output.write("\n");
        if (terminal.isTTY) terminal.setRawMode(false);
        terminal.off("keypress", onKey);
        process.exit(130);
      }
      if (key.name === "return" || key.name === "enter") {
        output.write("\n");
        if (terminal.isTTY) terminal.setRawMode(false);
        terminal.off("keypress", onKey);
        resolve(value);
        return;
      }
      if (key.name === "backspace") {
        if (value.length) {
          value = value.slice(0, -1);
          if (!hidden) output.write("\b \b");
        }
        return;
      }
      if (!key.ctrl && !key.meta && character) {
        value += character;
        if (hidden) output.write("*");
        else output.write(character);
      }
    };
    terminal.on("keypress", onKey);
  });
}

async function main() {
  const full_name = (await ask("Owner full name: ")).trim();
  const email = (await ask("Owner email: ")).trim().toLowerCase();
  const phone = (await ask("Phone (optional, press Enter to skip): ")).trim() || null;
  const password = await ask("Password (minimum 12 characters; input hidden): ", { hidden: true });

  if (!full_name || !email.includes("@") || password.length < 12) {
    throw new Error("Enter a name, valid email, and password of at least 12 characters.");
  }

  await sequelize.authenticate();
  const existing = await User.findOne({ where: { email } });
  const password_hash = await bcrypt.hash(password, 12);

  if (existing) {
    if (existing.role === "admin") throw new Error("This email already has an admin account; no changes made.");
    if (existing.role !== "customer") throw new Error("Only an existing customer account can be promoted to admin.");
    const confirm = await ask(`Promote ${email} to the owner/admin role? Type PROMOTE to confirm: `);
    if (confirm !== "PROMOTE") throw new Error("Confirmation did not match; no changes made.");
    await existing.update({ full_name, phone: phone || existing.phone, password_hash, role: "admin", is_active: true, is_verified: true });
    console.log(`Owner/admin role enabled for ${email}.`);
  } else {
    await User.create({ full_name, email, phone, password_hash, role: "admin", is_active: true, is_verified: true });
    console.log(`Owner/admin account created for ${email}.`);
  }
  console.log("Sign in at /admin/login. Store the password safely; it is not printed or saved by this script.");
}

try {
  await main();
} catch (error) {
  console.error(`Admin setup failed: ${error.message}`);
  process.exitCode = 1;
} finally {
  await sequelize.close();
}
