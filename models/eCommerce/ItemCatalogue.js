const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/dbConnection");
const Category = require("./Category");

const ItemCatalogue = sequelize.define(
  "ItemCatalogue",
  {
    item_code: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    category_code: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Category, // Foreign key reference
        key: "category_code",
      },
      onDelete: "CASCADE", // If a category is deleted, delete related items
    },
    item_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    item_icon: {
      type: DataTypes.STRING,
      allowNull: false,
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
    tableName: "item_catalogue",
  }
);

// Define Relationship: Each item belongs to a category
Category.hasMany(ItemCatalogue, { foreignKey: "category_code" });
ItemCatalogue.belongsTo(Category, { foreignKey: "category_code" });

module.exports = ItemCatalogue;
