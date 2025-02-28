const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/dbConnection");
const Production = require("./production");
const User = require("../user");

const ProductionQualityCheck = sequelize.define(
  "ProductionQualityCheck",
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    quality_check_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    production_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Production,
        key: "id",
      },
    },
    batch_number: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    checked_by_user_id: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: User,
        key: "user_id",
      },
    },
    overall_status: {
      type: DataTypes.ENUM("Pending", "Approved", "Rejected", "Rework_Needed"),
      allowNull: false,
      defaultValue: "Pending",
    },
    defects_found: {
      type: DataTypes.TEXT,
    },
    corrective_action: {
      type: DataTypes.TEXT,
    },
    remarks: {
      type: DataTypes.TEXT,
    },
    updated_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: false,
    tableName: "production_quality_check",
  }
);

// Associations
ProductionQualityCheck.belongsTo(Production, { foreignKey: "production_id" });
Production.hasOne(ProductionQualityCheck, { foreignKey: "production_id" });

ProductionQualityCheck.belongsTo(User, { foreignKey: "checked_by_user_id" });
User.hasMany(ProductionQualityCheck, { foreignKey: "checked_by_user_id" });

module.exports = ProductionQualityCheck;
