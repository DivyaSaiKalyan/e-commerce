const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/dbConnection");
const ProductCatalogue = require("./productCatalogue");

const ProductInfo = sequelize.define(
  "ProductInfo",
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    product_code: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    product_info: {
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
    tableName: "product_info",
  }
);

ProductCatalogue.hasMany(ProductInfo, {
  foreignKey: "product_code",
});

ProductInfo.belongsTo(ProductCatalogue, {
  foreignKey: "product_code",
});

module.exports = ProductInfo;
