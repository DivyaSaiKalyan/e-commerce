const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/dbConnection");
const User = require("../User/user"); // Import User model

const StockOrder = sequelize.define(
  "StockOrder",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    stock_order_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    user_id: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: User,
        key: "user_id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    order_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    symbol: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    units: {
      type: DataTypes.DECIMAL,
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
    stock_order_status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Open",
    },
  },
  {
    tableName: "stock_order",
    timestamps: false, // No default createdAt and updatedAt
  }
);

// Define associations
StockOrder.belongsTo(User, {
  foreignKey: "user_id",
  as: "User",
});

User.hasMany(StockOrder, {
  foreignKey: "user_id",
  as: "StockOrders",
});

module.exports = StockOrder;
