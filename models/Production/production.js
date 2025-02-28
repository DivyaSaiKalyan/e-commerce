const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/dbConnection");
const User = require("../user");
const ProductCatalogue = require("../eCommerce/productCatalogue");

const Production = sequelize.define(
  "Production",
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    production_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    expected_completion_date: {
      type: DataTypes.DATE,
    },
    actual_completion_date: {
      type: DataTypes.DATE,
    },
    batch_number: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    product_code: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: ProductCatalogue, // Foreign key reference
        key: "product_code",
      },
    },
    quantity_produced: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    labor_cost: {
      type: DataTypes.DECIMAL,
    },
    team_user_id: {
      type: DataTypes.STRING,
      references: {
        model: User, // Foreign key reference
        key: "user_id",
      },
    },
    quality_check_status: {
      type: DataTypes.ENUM("Pending", "Approved", "Rejected"),
      allowNull: false,
      defaultValue: "Pending",
    },
    remarks: {
      type: DataTypes.STRING,
    },
    production_status: {
      type: DataTypes.ENUM("Planned", "In_Progress", "Completed", "Canceled"),
      allowNull: false,
      defaultValue: "Planned",
    },
  },
  {
    timestamps: false,
    tableName: "production",
  }
);

// Associations
Production.belongsTo(ProductCatalogue, { foreignKey: "product_code" });
Production.belongsTo(User, { foreignKey: "team_user_id" });

module.exports = Production;
