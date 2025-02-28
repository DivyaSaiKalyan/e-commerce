const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/dbConnection");
const OrderCart = require("./orderCart");

const OrderCancel = sequelize.define(
  "OrderCancel",
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    order_cancel_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW, // System generated timestamp
    },
    order_no: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: OrderCart, // Foreign key reference
        key: "id",
      },
      onDelete: "CASCADE", // If order is deleted, cancel details will also be deleted
    },
    reason: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: false,
    tableName: "order_cancel",
  }
);

// Define Relationship: An order can have one cancellation record
OrderCart.hasOne(OrderCancel, {
  foreignKey: "order_no",
  as: "cancel_details",
});

OrderCancel.belongsTo(OrderCart, {
  foreignKey: "order_no",
});

module.exports = OrderCancel;
