const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/dbConnection");
const Company = require("./company"); // Import the Company model

const VdcStockValue = sequelize.define(
  "VdcStockValue",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    stock_value_date: {
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
    est_stock_units: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    est_stock_price: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    est_stock_total_value: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
  },
  {
    tableName: "vdc_stock_value",
    timestamps: false, // No default createdAt and updatedAt
  }
);

// Define associations
VdcStockValue.belongsTo(Company, { foreignKey: "company_code", as: "Company" });

module.exports = VdcStockValue;
