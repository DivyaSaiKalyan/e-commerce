const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/dbConnection");
const User = require("../User/user");

const WalletTransaction = sequelize.define(
  "WalletTransaction",
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    transaction_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    transfer_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sub_transfer_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    transfer_logo_path: {
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
    trans_agent_user_id: {
      type: DataTypes.STRING,
      references: {
        model: User,
        key: "user_id",
      },
    },
    transfer_amount: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    transfer_currency: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    transaction_ref_no: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    transaction_status: {
      type: DataTypes.ENUM("New", "Pending", "Done"),
      allowNull: false,
      defaultValue: "New",
    },
    loyalty_coins: {
      type: DataTypes.DECIMAL,
      allowNull: true,
    },
    receipt_image_path: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    updated_date: {
      type: DataTypes.DATE,
    },
  },
  {
    timestamps: false,
    tableName: "wallet_transactions",
  }
);

WalletTransaction.belongsTo(User, {
  foreignKey: "transfer_user_id",
});
WalletTransaction.belongsTo(User, {
  foreignKey: "receive_user_id",
});
WalletTransaction.belongsTo(User, {
  foreignKey: "trans_agent_no",
});

module.exports = WalletTransaction;
