const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/dbConnection");
const User = require("../User/user");

const GapProfile = sequelize.define("GapProfile", {
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
      key: "user_id",
    },
  },
  profile_type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  profile_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  profile_status: {
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
});

GapProfile.belongsTo(User, {
  foreignKey: "user_id",
  as: "User",
});

module.exports = GapProfile;
