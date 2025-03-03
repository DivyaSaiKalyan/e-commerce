const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/dbConnection");
const User = require("../User/user");
const Recipient = require("./recipient");

const OutboundTransaction = sequelize.define(
  "OutboundTransaction",
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
    recipient_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: Recipient,
        key: "id",
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
      allowNull: false,
    },
    receive_amount: {
      type: DataTypes.DECIMAL,
      allowNull: false,
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
    transfer_order_accepted_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    transfer_order_confirmed_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    transfer_receipt_image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    transfer_status: {
      type: DataTypes.ENUM("New", "Accept", "Transfer", "Done"),
      allowNull: false,
      defaultValue: "New",
    },
    transfer_purpose: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: false,
    tableName: "outbound_transactions",
  }
);

OutboundTransaction.belongsTo(User, { foreignKey: "user_id" });
//OutboundTransaction.belongsTo(Recipient, { foreignKey: "recipient_id" });
OutboundTransaction.belongsTo(Recipient, {
  foreignKey: "recipient_id",
});
OutboundTransaction.belongsTo(User, {
  foreignKey: "trans_agent_user_id",
});

module.exports = OutboundTransaction;
