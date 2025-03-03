const { DataTypes } = require("sequelize");
const Company = require("./company"); // Import Company model
const { sequelize } = require("../../config/dbConnection");

const StockAllocation = sequelize.define(
  "StockAllocation",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    stock_alloc_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    company_code: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Company,
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    category: {
      type: DataTypes.ENUM("IPO", "OR", "IIO"),
      allowNull: false,
    },
    source_of_allocation: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    stock_allocation: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    stock_consume: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    stock_available: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    locking_period_in_months: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    updated_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "stock_allocation",
    timestamps: false, // No default createdAt and updatedAt
  }
);

// Define associations
StockAllocation.belongsTo(Company, {
  foreignKey: "company_code",
  as: "Company",
});

Company.hasMany(StockAllocation, {
  foreignKey: "company_code",
  as: "StockAllocations",
});

module.exports = StockAllocation;
