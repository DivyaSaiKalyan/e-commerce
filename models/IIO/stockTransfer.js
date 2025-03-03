const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/dbConnection");
const User = require("../User/user");

const StockTransfer = sequelize.define(
  "StockTransfer",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    stock_transfer_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    buyer_user_id: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: User,
        key: "user_id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    seller_user_id: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: User,
        key: "user_id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    symbol: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    trans_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    stock_price: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    units: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    total_value: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
  },
  {
    tableName: "stock_transfer",
    timestamps: false, // No default createdAt and updatedAt
  }
);

// Define associations
StockTransfer.belongsTo(User, {
  foreignKey: "buyer_user_id",
  as: "Buyer",
});

StockTransfer.belongsTo(User, {
  foreignKey: "seller_user_id",
  as: "Seller",
});

User.hasMany(StockTransfer, {
  foreignKey: "buyer_user_id",
  as: "BoughtStocks",
});

User.hasMany(StockTransfer, {
  foreignKey: "seller_user_id",
  as: "SoldStocks",
});

module.exports = StockTransfer;
