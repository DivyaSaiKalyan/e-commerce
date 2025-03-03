const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/dbConnection");
const Company = require("./company"); // Import the Company model

const Ledger = sequelize.define(
  "Ledger",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    ledger_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    company_code: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Company, // References the Company model
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    ledger_amount: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    total_amount: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    growth_value: {
      type: DataTypes.DECIMAL,
      allowNull: true,
    },
  },
  {
    tableName: "ledger",
    timestamps: false, // No default createdAt and updatedAt
  }
);

// Company.hasMany(Ledger, {
//   foreignKey: "company_code",
// });

// Define associations
Ledger.belongsTo(Company, { foreignKey: "company_code", as: "Company" });

module.exports = Ledger;
