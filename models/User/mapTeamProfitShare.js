const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/dbConnection");
const MapTeam = require("./mapTeam"); // Import MapTeam model

const MapTeamProfitShare = sequelize.define(
  "MapTeamProfitShare",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    profit_share_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    team_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: MapTeam,
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    profit_share: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    team_profit_share: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
  },
  {
    tableName: "map_team_profit_share",
    timestamps: false, // Disabling default timestamps
  }
);

// Define Association: Each profit share entry belongs to a specific team
MapTeamProfitShare.belongsTo(MapTeam, {
  foreignKey: "team_id",
  as: "Team",
});

module.exports = MapTeamProfitShare;
