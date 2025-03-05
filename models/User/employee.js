const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/dbConnection");
const User = require("../User/user"); // Import User model
const MapTeam = require("./mapTeam"); // Import MapTeam model
const Company = require("../IIO/company");

const Employee = sequelize.define(
  "Employee",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    emp_id: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
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
    area_code: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    company_code: {
      type: DataTypes.INTEGER,
      references: {
        model: Company,
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    emp_type: {
      type: DataTypes.STRING,
      defaultValue: "E",
    },
    team_id: {
      type: DataTypes.INTEGER,
      references: {
        model: MapTeam,
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    },
    prev_team_id: {
      type: DataTypes.INTEGER,
      references: {
        model: MapTeam,
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    },
    employment_status: {
      type: DataTypes.STRING,
      defaultValue: "Active",
      allowNull: false,
    },
    date_of_hire: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "employee",
    timestamps: false, // Disabling default timestamps
  }
);

// Define Associations
Employee.belongsTo(User, {
  foreignKey: "user_id",
  as: "User",
});

Employee.belongsTo(Company, {
  foreignKey: "company_code",
  as: "Company",
});

Employee.belongsTo(MapTeam, {
  foreignKey: "team_id",
  as: "CurrentTeam",
});

Employee.belongsTo(MapTeam, {
  foreignKey: "prev_team_id",
  as: "PreviousTeam",
});

module.exports = Employee;
