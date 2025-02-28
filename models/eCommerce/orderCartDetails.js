const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/dbConnection");
const OrderCart = require("./orderCart");
const ProductCatalogue = require("./productCatalogue");

const OrderCartDetails = sequelize.define(
  "OrderCartDetails",
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    order_details_date: {
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
      onDelete: "CASCADE", // If order is deleted, delete related details
    },
    product_code: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: ProductCatalogue, // Foreign key reference
        key: "product_code",
      },
      onDelete: "CASCADE", // If product is deleted, delete related details
    },
    quantity: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    unit_price: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    gst_amount: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    total_price: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
  },
  {
    timestamps: false,
    tableName: "order_cart_details",
  }
);

// Define Relationships
OrderCart.hasMany(OrderCartDetails, {
  foreignKey: "order_no",
  as: "order_details",
});

OrderCartDetails.belongsTo(OrderCart, {
  foreignKey: "order_no",
});

ProductCatalogue.hasMany(OrderCartDetails, {
  foreignKey: "product_code",
  as: "product_orders",
});

OrderCartDetails.belongsTo(ProductCatalogue, {
  foreignKey: "product_code",
});

module.exports = OrderCartDetails;
