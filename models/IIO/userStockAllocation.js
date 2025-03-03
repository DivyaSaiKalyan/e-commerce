const { DataTypes } = require("sequelize");
const Company = require("./company"); // Import Company model
const User = require("../User/user"); // Import User model
const { sequelize } = require("../../config/dbConnection");

const UserStockAllocation = sequelize.define(
  "UserStockAllocation",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    stock_alloc_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    user_id: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: User,
        key: "user_id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
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
    trans_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    units: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    stock_price: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    total_value: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
  },
  {
    tableName: "user_stock_allocation",
    timestamps: false, // No default createdAt and updatedAt
  }
);

// Define associations
UserStockAllocation.belongsTo(Company, {
  foreignKey: "company_code",
  as: "Company",
});

Company.hasMany(UserStockAllocation, {
  foreignKey: "company_code",
  as: "UserStockAllocations",
});

UserStockAllocation.belongsTo(User, {
  foreignKey: "user_id",
  as: "User",
});

User.hasMany(UserStockAllocation, {
  foreignKey: "user_id",
  as: "StockAllocations",
});

module.exports = UserStockAllocation;
