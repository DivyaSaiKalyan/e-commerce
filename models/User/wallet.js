const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/dbConnection");
const User = require("../User/user"); // Import the User model

const Wallet = sequelize.define(
  "Wallet",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: User, // Foreign key reference
        key: "id",
      },
    },
    symbol: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    quantity_hold: {
      type: DataTypes.DECIMAL,
      allowNull: true,
    },
    stock_profits: {
      type: DataTypes.DECIMAL,
      allowNull: true,
    },
    created_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "wallet",
    timestamps: false, // Disabling default timestamps
  }
);

// Define associations
Wallet.belongsTo(User, { foreignKey: "user_id", as: "User" });

module.exports = Wallet;
