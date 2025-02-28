const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/dbConnection");
const OrderCart = require("./orderCart");

const OrderTracking = sequelize.define(
  "OrderTracking",
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    order_tracking_date: {
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
      onDelete: "CASCADE", // If order is deleted, delete tracking info
    },
    current_location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    delivery_attempts: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0, // Default value is 0
    },
    message: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: false,
    tableName: "order_tracking",
  }
);

// Define Relationship: An order can have multiple tracking records
OrderCart.hasMany(OrderTracking, {
  foreignKey: "order_no",
  as: "tracking_details",
});

OrderTracking.belongsTo(OrderCart, {
  foreignKey: "order_no",
});

module.exports = OrderTracking;
