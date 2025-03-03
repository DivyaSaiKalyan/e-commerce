const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/dbConnection");
const User = require("../User/user"); // Import the User model
const Company = require("./company"); // Import the Company model

const Dividend = sequelize.define(
  "Dividend",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    dividend_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
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
    dividend_amount: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
  },
  {
    tableName: "dividend",
    timestamps: false, // No default createdAt and updatedAt
  }
);

// **Associations**

Dividend.belongsTo(User, {
  foreignKey: "user_id",
  as: "User",
});
Dividend.belongsTo(Company, {
  foreignKey: "company_code",
  as: "Company",
});

module.exports = Dividend;
