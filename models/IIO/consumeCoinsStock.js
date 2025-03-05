const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/dbConnection");
const User = require("../User/user"); // Import User model

const ConsumeCoinsStock = sequelize.define(
  "ConsumeCoinsStock",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    consume_coin_trans_date: {
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
    pre_consume_coins_stock: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    current_consume_coins_stock: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    current_coin_price: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
  },
  {
    tableName: "consume_coins_stock",
    timestamps: false, // No default createdAt and updatedAt
  }
);

// **Associations**
ConsumeCoinsStock.belongsTo(User, {
  foreignKey: "user_id",
  as: "User",
});

module.exports = ConsumeCoinsStock;
