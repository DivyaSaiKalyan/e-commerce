const { DataTypes } = require("sequelize");
const Company = require("./company"); // Import Company model
const { sequelize } = require("../../config/dbConnection");

const TreasuryFundsTransfer = sequelize.define(
  "TreasuryFundsTransfer",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    transfer_date: {
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
    investment_amount: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
  },
  {
    tableName: "treasury_funds_transfer",
    timestamps: false, // No default createdAt and updatedAt
  }
);

// Define associations
TreasuryFundsTransfer.belongsTo(Company, {
  foreignKey: "company_code",
  as: "Company",
});

Company.hasMany(TreasuryFundsTransfer, {
  foreignKey: "company_code",
  as: "TreasuryTransfers",
});

module.exports = TreasuryFundsTransfer;
