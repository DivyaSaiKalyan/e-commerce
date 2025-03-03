const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/dbConnection");

const MapTeam = sequelize.define(
  "MapTeam",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    team_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    designation: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    department: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    location: {
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
    lead_team_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    team_created_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "map_team",
    timestamps: false, // Disabling default timestamps
  }
);

// Define self-association (Team leads another team)
MapTeam.belongsTo(MapTeam, {
  foreignKey: "lead_team_id",
  as: "LeadTeam",
});

module.exports = MapTeam;
