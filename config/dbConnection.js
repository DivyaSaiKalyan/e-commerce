const { Sequelize } = require("sequelize");
const dotenv = require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "postgres",
    logging: false, // Set to true to see SQL queries in logs
  }
);

async function connectDB() {
  try {
    await sequelize.authenticate();
    console.log("PostgreSQL Connected!");
  } catch (error) {
    console.error("Connection Failed:", error);
  }
}

module.exports = { connectDB, sequelize };
