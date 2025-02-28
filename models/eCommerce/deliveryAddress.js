const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/dbConnection");
const User = require("../user");

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
    area_name: {
      type: DataTypes.STRING,
      allowNull: false,
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
    country: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    postal_code: {
      type: DataTypes.STRING,
      allowNull: false,
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
