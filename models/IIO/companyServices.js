const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/dbConnection");
const Company = require("./company"); // Import Company model

const CompanyServices = sequelize.define(
  "CompanyServices",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    company_code: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Company,
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    service_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    industry: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    about_service: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    service_icon_path: {
      type: DataTypes.STRING,
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
    tableName: "company_services",
    timestamps: false, // No default createdAt and updatedAt
  }
);

// Define associations
CompanyServices.belongsTo(Company, {
  foreignKey: "company_code",
  as: "Company",
});

Company.hasMany(CompanyServices, {
  foreignKey: "company_code",
  as: "Services",
});

module.exports = CompanyServices;
