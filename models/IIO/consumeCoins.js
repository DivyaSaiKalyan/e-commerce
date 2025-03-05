const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/dbConnection");
const User = require("../User/user");

const ConsumeCoins = sequelize.define(
  "ConsumeCoins",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    consume_coin_date: {
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
    trans_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    coins: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    coin_price: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
  },
  {
    tableName: "consume_coins",
    timestamps: false, // No default createdAt and updatedAt
  }
);

// **Associations**
ConsumeCoins.belongsTo(User, {
  foreignKey: "user_id",
  as: "User",
});

module.exports = ConsumeCoins;
