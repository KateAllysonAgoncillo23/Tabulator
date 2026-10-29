import { DataTypes, Sequelize } from "sequelize";
import inquirer from "inquirer";
import { databaseName, sequelize } from "./models/db.js";
import { seedDefaults } from "./models/seed.js";

const rootSequelize = new Sequelize(
  "mysql",
  process.env.DB_USER || "root",
  process.env.DB_PASSWORD || "",
  {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT || 3306),
    dialect: "mysql",
    logging: false,
  }
);

try {
  const createDb = process.argv.includes("--create-db")
    ? true
    : (await inquirer.prompt([
        {
          type: "confirm",
          name: "createDb",
          message: `Database '${databaseName}' may not exist. Create it?`,
          default: true,
        },
      ])).createDb;

  if (createDb) {
    const quotedDatabaseName = databaseName.replace(/`/g, "``");
    await rootSequelize.query(`CREATE DATABASE IF NOT EXISTS \`${quotedDatabaseName}\`;`);
    console.log(`Database '${databaseName}' created (if it did not exist).`);
  }

  await sequelize.authenticate();
  console.log("Connected to MySQL database.");
  await sequelize.sync();
  for (const tableName of ["users", "events", "system_settings", "homepage_videos"]) {
    const columns = await sequelize.getQueryInterface().describeTable(tableName);
    if (!columns.deletedAt) {
      await sequelize.getQueryInterface().addColumn(tableName, "deletedAt", {
        type: DataTypes.DATE,
        allowNull: true,
      });
      console.log(`Added archive support to ${tableName}.`);
    }
  }
  const contestantColumns = await sequelize.getQueryInterface().describeTable("contestants");
  if (!contestantColumns.imageUrl) {
    await sequelize.getQueryInterface().addColumn("contestants", "imageUrl", {
      type: DataTypes.STRING,
      allowNull: true,
    });
    console.log("Added optional contestant image URL column.");
  } else {
    console.log("Contestant image URL column is already present.");
  }
  await seedDefaults();
  console.log("Tables are ready and default accounts/settings are seeded.");
} catch (error) {
  console.error("Migration failed:", error);
  process.exitCode = 1;
} finally {
  await Promise.all([sequelize.close(), rootSequelize.close()]);
}
