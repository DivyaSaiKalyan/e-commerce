const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/dbConnection.js");
const User = require("../user.js");

const Store = sequelize.define(
  "Store",
  {
    store_id: {
      type: DataTypes.INTEGER,
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
      onDelete: "CASCADE", // If user is deleted, delete related stores
    },
    store_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    store_type: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    area_code: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    store_address: {
      type: DataTypes.STRING, // Changed from Decimal to STRING (address should be textual)
      allowNull: false,
    },
    contact_number: {
      type: DataTypes.STRING,
    },
    email_id: {
      type: DataTypes.STRING,
      validate: {
        isEmail: true, // Ensures valid email format
      },
    },
    lat_location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lng_location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("Active", "Inactive", "Closed"),
      defaultValue: "Active",
    },
    about_store: {
      type: DataTypes.STRING,
    },
    created_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW, // System-generated timestamp
    },
    updated_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: false,
    tableName: "store",
  }
);

// Define Relationship: A user can have multiple stores
User.hasMany(Store, {
  foreignKey: "user_id",
  //as: "store",
});

Store.belongsTo(User, {
  foreignKey: "user_id",
  //as: "user",
});

module.exports = Store;
