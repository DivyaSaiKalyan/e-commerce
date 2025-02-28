const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/dbConnection");
const User = require("../user"); // Import User model for foreign key reference

const Bank = sequelize.define(
  "Bank",
  {
    bank_id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: User, // Foreign key reference
        key: "user_id",
      },
      onDelete: "CASCADE", // Delete bank details if the user is deleted
    },
    currency_code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    bank_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    bank_icon: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    bank_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    account_number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    account_holder_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    created_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW, // System-generated timestamp
    },
    updated_date: {
      type: DataTypes.DATE,
      allowNull: true, // Can be NULL initially
    },
  },
  {
    timestamps: false, // We are handling dates manually
    tableName: "bank",
  }
);

// Define Relationship: A user can have multiple bank accounts
User.hasMany(Bank, {
  foreignKey: "user_id",
});

Bank.belongsTo(User, {
  foreignKey: "user_id",
});

module.exports = Bank;
