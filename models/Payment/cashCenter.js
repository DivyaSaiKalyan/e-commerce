const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/dbConnection");

const CashCenter = sequelize.define(
  "CashCenter",
  {
    cash_center_id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    cash_center_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    area_code: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lat_location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lng_location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mobile_number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    created_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW, // System-generated timestamp
    },
    updated_date: {
      type: DataTypes.DATE,
      allowNull: true, // Can be NULL initially
    },
  },
  {
    timestamps: false, // We are handling dates manually
    tableName: "cash_center",
  }
);

module.exports = CashCenter;
