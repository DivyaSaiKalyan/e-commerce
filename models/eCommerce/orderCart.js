const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/dbConnection");
const DeliveryAddress = require("./deliveryAddress.js");
const Store = require("../Production/store.js");
const User = require("../User/user.js");

const OrderCart = sequelize.define(
  "OrderCart",
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    order_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW, // System generated date
    },
    user_id: {
      type: DataTypes.STRING, // Assuming VARCHAR means STRING in Sequelize
      allowNull: false,
      references: {
        model: User, // Foreign key reference
        key: "user_id",
      },
      onDelete: "CASCADE",
    },
    store_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Store, // Foreign key reference
        key: "store_id",
      },
      onDelete: "CASCADE",
    },
    order_type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [["CO", "PO"]], // CO = Cash Order, PO = Prepaid Order
      },
    },
    invoice_no: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    order_amount: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    gst_amount: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    total_amount: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    loyalty_coins: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    order_payment_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    store_accept_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    store_dispatch_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    order_delivery_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    order_delivery_address_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: DeliveryAddress,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    order_delivery_user_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    order_status: {
      type: DataTypes.STRING(9),
      allowNull: false,
      defaultValue: "New",
      validate: {
        isIn: [["New", "Payment", "Accept", "Dispatch", "Delivery"]],
      },
    },
    customer_otp: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    store_otp: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    timestamps: false,
    tableName: "order_cart",
  }
);

//user needs to import
// Order belongs to a User
OrderCart.belongsTo(User, { foreignKey: "user_id" });

//store needs to import
// Order belongs to a Store
OrderCart.belongsTo(Store, { foreignKey: "store_id" });

// Order belongs to an DeliveryAddress
OrderCart.belongsTo(DeliveryAddress, {
  foreignKey: "order_delivery_address_id",
});

module.exports = OrderCart;
