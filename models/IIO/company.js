const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/dbConnection");
const StartupIdea = require("./startupIdea"); // Import StartupIdea model

const Company = sequelize.define(
  "Company",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    company_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    industry: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    symbol: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    iio_category: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Seed",
    },
    stock_price: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    growth_value: {
      type: DataTypes.DECIMAL,
      allowNull: true,
    },
    company_status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Active",
    },
    startup_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: StartupIdea, // Foreign key reference
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    company_logo_path: {
      type: DataTypes.STRING,
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
    tableName: "company",
    timestamps: false, // Since created_date and updated_date are manually handled
  }
);

// Define associations
Company.belongsTo(StartupIdea, {
  foreignKey: "startup_id",
  as: "StartupIdea",
});

StartupIdea.hasMany(Company, {
  foreignKey: "startup_id",
  as: "Companies",
});

module.exports = Company;
