const { DataTypes } = require("sequelize");
const Company = require("./company"); // Import Company model
const { sequelize } = require("../../config/dbConnection");

const CompanyProgressLog = sequelize.define(
  "CompanyProgressLog",
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
    progress_log: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    department: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    created_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "company_progress_log",
    timestamps: false, // No default createdAt and updatedAt
  }
);

// Define associations
CompanyProgressLog.belongsTo(Company, {
  foreignKey: "company_code",
  as: "Company",
});

Company.hasMany(CompanyProgressLog, {
  foreignKey: "company_code",
  as: "ProgressLogs",
});

module.exports = CompanyProgressLog;
