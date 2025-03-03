const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/dbConnection");
const Company = require("./company"); // Import Company model

const AboutCompany = sequelize.define(
  "AboutCompany",
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
    about_company: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "about_company",
    timestamps: false, // No created_at or updated_at fields
  }
);

// Define associations
AboutCompany.belongsTo(Company, {
  foreignKey: "company_code",
  as: "Company",
});

Company.hasOne(AboutCompany, {
  foreignKey: "company_code",
  as: "AboutCompany",
});

module.exports = AboutCompany;
