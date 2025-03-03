const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/dbConnection");
const User = require("../User/user"); // Import User model for the foreign key relationship

const StartupIdea = sequelize.define(
  "StartupIdea",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
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
    title_of_an_idea: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    industry: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    about_an_idea: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("New", "Active", "Reject"),
      allowNull: false,
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
  },
  {
    tableName: "startup_idea",
    timestamps: false, // Since we manually handle created_date and updated_date
  }
);

// Define associations
StartupIdea.belongsTo(User, {
  foreignKey: "user_id",
  as: "User",
});

User.hasMany(StartupIdea, {
  foreignKey: "user_id",
  as: "StartupIdeas",
});

module.exports = StartupIdea;
