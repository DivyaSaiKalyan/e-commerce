const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/dbConnection");

const Category = sequelize.define(
  "Category",
  {
    category_code: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    category_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sub_category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    category_icon: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sub_category_icon: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    created_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW, // Automatically set to system date
    },
    updated_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW, // Automatically set to system date
    },
  },
  {
    timestamps: false, // Disable Sequelize's default createdAt and updatedAt fields
    tableName: "categories", // Explicitly define table name
  }
);

module.exports = Category;
