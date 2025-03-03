const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/dbConnection");
const User = require("../User/user");

const InboundTransaction = sequelize.define(
  "InboundTransaction",
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
    transfer_currency: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    transfer_amount: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    receive_currency: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    receive_amount: {
      type: DataTypes.DECIMAL,
      allowNull: true,
    },
    exchange_rate: {
      type: DataTypes.DECIMAL,
      allowNull: true,
    },
    transaction_fees: {
      type: DataTypes.DECIMAL,
      allowNull: true,
    },
    trans_agent_user_id: {
      type: DataTypes.STRING,
      references: {
        model: User,
        key: "user_id",
      },
    },
    bank_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    account_number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    account_holder_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    transfer_receipt_image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    transfer_status: {
      type: DataTypes.ENUM("Transfer", "Done"),
      allowNull: false,
      defaultValue: "Transfer",
    },
    updated_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    timestamps: false,
    tableName: "inbound_transactions",
  }
);

InboundTransaction.belongsTo(User, {
  foreignKey: "transfer_user_id",
});
InboundTransaction.belongsTo(User, {
  foreignKey: "trans_agent_user_id",
});

module.exports = InboundTransaction;
