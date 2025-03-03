const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/dbConnection");

const Role = sequelize.define(
  "Role",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
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
    tableName: "role",
    timestamps: false, // No default createdAt and updatedAt
  }
);

module.exports = Role;
