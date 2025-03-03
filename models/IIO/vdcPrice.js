const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/dbConnection");

const VdcPrice = sequelize.define(
  "VdcPrice",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    vdc_price_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    ledger_amount: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    est_stocks_amount: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    stocks_sale_amount: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    total_amount: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    total_vgc_units: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    vdc_price: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
  },
  {
    tableName: "vdc_price",
    timestamps: false, // No default createdAt and updatedAt
  }
);

module.exports = VdcPrice;
