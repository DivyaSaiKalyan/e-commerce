const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/dbConnection");
const User = require("../User/user"); // Import User model
const Company = require("./company"); // Import Company model
const Employee = require("../User/employee");

const Investment = sequelize.define(
  "Investment",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    investment_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    user_id: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    area_code: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    investment_type: {
      type: DataTypes.STRING,
      allowNull: false,
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
    investment_amount: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    stock_units: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    ref_emp_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Employee,
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
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
    tableName: "investment",
    timestamps: false, // No default createdAt and updatedAt
  }
);

// **Associations**
Investment.belongsTo(User, {
  foreignKey: "user_id",
  as: "User",
});

Investment.belongsTo(Company, {
  foreignKey: "company_code",
  as: "Company",
});

Investment.belongsTo(Employee, {
  foreignKey: "ref_emp_id",
  as: "ReferredEmployee",
});

module.exports = Investment;
