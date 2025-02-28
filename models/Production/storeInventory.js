const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/dbConnection");
const Store = require("./store"); // Assuming Store model exists
const ProductCatalogue = require("../eCommerce/productCatalogue");

const StoreInventory = sequelize.define(
  "StoreInventory",
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    store_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Store,
        key: "store_id",
      },
    },
    product_code: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: ProductCatalogue,
        key: "product_code",
      },
    },
    quantity_available: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    quantity_reserved: {
      type: DataTypes.DECIMAL,
      allowNull: true,
    },
    reorder_level: {
      type: DataTypes.DECIMAL,
      allowNull: true,
    },
    created_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: false,
    tableName: "store_inventory",
    indexes: [
      {
        unique: true,
        fields: ["store_id", "product_code"], // Ensure uniqueness
      },
    ],
  }
);

// Associations
StoreInventory.belongsTo(Store, { foreignKey: "store_id" });
Store.hasMany(StoreInventory, { foreignKey: "store_id" });

StoreInventory.belongsTo(ProductCatalogue, { foreignKey: "product_code" });
ProductCatalogue.hasMany(StoreInventory, { foreignKey: "product_code" });

module.exports = StoreInventory;
