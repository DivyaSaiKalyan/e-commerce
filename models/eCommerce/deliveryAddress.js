const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/dbConnection");
const User = require("../User/user");

const DeliveryAddress = sequelize.define(
  "DeliveryAddress",
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    delivery_address_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW, // System generated timestamp
    },
    user_id: {
      type: DataTypes.STRING, // Assuming user_id is a VARCHAR
      allowNull: false,
      references: {
        model: User, // Foreign key reference
        key: "user_id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE", // If user is deleted, delete delivery addresses
    },
    address_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    house_no: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address1: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address2: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    land_mark: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    postal_code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lat_location: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    lng_location: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    address_proof_link: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "New",
    },
  },
  {
    timestamps: false,
    tableName: "delivery_address",
  }
);

//Define Relationship: A user can have multiple delivery addresses
User.hasMany(DeliveryAddress, {
  foreignKey: "user_id",
});

DeliveryAddress.belongsTo(User, {
  foreignKey: "user_id",
});

module.exports = DeliveryAddress;
