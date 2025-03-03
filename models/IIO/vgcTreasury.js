const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/dbConnection");

const VGCTreasury = sequelize.define(
  "VGCTreasury",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    transaction_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    new_coins: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    total_coins: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
  },
  {
    tableName: "vgc_treasury",
    timestamps: false, // No default createdAt and updatedAt
  }
);

module.exports = VGCTreasury;
