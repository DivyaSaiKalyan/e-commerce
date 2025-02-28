const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/dbConnection");
const User = require("../user");

const MobileTransfer = sequelize.define(
  "MobileTransfer",
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    transfer_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    transfer_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    transfer_user_id: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: User,
        key: "user_id",
      },
    },
    receive_user_id: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: User,
        key: "user_id",
      },
    },
    transfer_amount: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
  },
  { timestamps: false, tableName: "mobile_transfer" }
);

// Associations
MobileTransfer.belongsTo(User, {
  foreignKey: "transfer_user_id",
});
MobileTransfer.belongsTo(User, {
  foreignKey: "receive_user_id",
});

module.exports = MobileTransfer;
