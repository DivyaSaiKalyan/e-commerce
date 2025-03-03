const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/dbConnection");

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
      type: DataTypes.TEXT, // URL for profile pic
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
        isEmail: true, // Ensure valid email format
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
      defaultValue: DataTypes.NOW, // System generated timestamp
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

module.exports = User;
