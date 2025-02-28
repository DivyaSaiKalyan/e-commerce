const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/dbConnection");

const CurrencyTable = sequelize.define(
  "CurrencyTable",
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    from_currency: {
      type: DataTypes.STRING(3),
      allowNull: false,
    },
    to_currency: {
      type: DataTypes.STRING(3),
      allowNull: false,
    },
    exchange_rate: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    transaction_fees: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    from_currency_icon: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    to_currency_icon: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    created_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    timestamps: false, // We are handling dates manually
    tableName: "currency_table",
  }
);

module.exports = CurrencyTable;
