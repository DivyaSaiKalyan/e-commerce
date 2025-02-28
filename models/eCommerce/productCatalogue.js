const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/dbConnection");
const ItemCatalogue = require("./ItemCatalogue"); // Import ItemCatalogue model

const ProductCatalogue = sequelize.define(
  "ProductCatalogue",
  {
    product_code: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    country_code: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    item_code: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: ItemCatalogue, // Foreign key reference
        key: "item_code",
      },
      onDelete: "CASCADE", // If an item is deleted, delete related products
    },
    product_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    product_desc: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    product_size: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    product_color: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    product_price: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    market_price: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    photo_links: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ref_link: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    product_dimensions: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    item_weight: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    manufacturer: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    created_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: false,
    tableName: "product_catalogue",
  }
);

// Define Relationship: Each item belongs to a ItemCatalogue
ItemCatalogue.hasMany(ProductCatalogue, {
  foreignKey: "item_code",
});

ProductCatalogue.belongsTo(ItemCatalogue, {
  foreignKey: "item_code",
});

module.exports = ProductCatalogue;
