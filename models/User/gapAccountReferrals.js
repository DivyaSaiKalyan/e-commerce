const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/dbConnection");
const User = require("../User/user");

const GapAccountReferrals = sequelize.define("GapAccountReferrals", {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: User,
      key: "id",
    },
  },
  ref_user_id: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: User,
      key: "id",
    },
  },
  ref_profile_type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  ref_profile_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: "New",
  },
  created_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updated_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

// Define associations
GapAccountReferrals.belongsTo(User, {
  foreignKey: "user_id",
  as: "User",
});

GapAccountReferrals.belongsTo(User, {
  foreignKey: "ref_user_id",
  as: "ReferredUser",
});

module.exports = GapAccountReferrals;
