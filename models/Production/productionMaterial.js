const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/dbConnection");
const Production = require("./production");

const ProductionMaterial = sequelize.define(
  "ProductionMaterial",
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    transaction_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    production_no: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Production, // Foreign key reference
        key: "id",
      },
    },
    material_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
  },
  {
    timestamps: false,
    tableName: "production_material",
  }
);

// Associations
ProductionMaterial.belongsTo(Production, { foreignKey: "production_no" });
Production.hasMany(ProductionMaterial, { foreignKey: "production_no" });

module.exports = ProductionMaterial;
