const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/dbConnection");
const Role = require("./role");

const User = sequelize.define(
  "User",
  {
    user_id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    password_hash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: Role, // Foreign key reference to Role table
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    area_code: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    profile_image: {
      type: DataTypes.TEXT,
    },
    gender: {
      type: DataTypes.STRING,
    },
    marital_status: {
      type: DataTypes.STRING,
    },
    fh_name: {
      type: DataTypes.STRING, // Father's/Husband's Name
    },
    date_of_birth: {
      type: DataTypes.DATE,
    },
    blood_group: {
      type: DataTypes.STRING,
    },
    country_code: {
      type: DataTypes.STRING,
    },
    mobile_number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email_id: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    lat_location: {
      type: DataTypes.STRING,
    },
    lng_location: {
      type: DataTypes.STRING,
    },
    user_status: {
      type: DataTypes.ENUM("Active", "Inactive"),
      allowNull: false,
      defaultValue: "Active",
    },
    created_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: false,
    tableName: "user",
  }
);

// Define Relationship: User belongs to Role
User.belongsTo(Role, {
  foreignKey: "role_id",
  as: "Role",
});

module.exports = User;
