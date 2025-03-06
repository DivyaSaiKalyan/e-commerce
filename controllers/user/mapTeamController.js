const asyncHandler = require("express-async-handler");
const MapTeam = require("../../models/User/mapTeam");
const { sequelize } = require("../../config/dbConnection");
const MapTeamProfitShare = require("../../models/User/mapTeamProfitShare");
const { Op } = require("sequelize");

//@dec create MapTeam
//@route POST /user/MapTeam/create
//@access public
const createMapTeam = asyncHandler(async (req, res) => {
  const {
    team_id,
    designation,
    department,
    location,
    state,
    country,
    lead_team_id,
  } = req.body;

  if (
    !team_id ||
    !designation ||
    !department ||
    !location ||
    !state ||
    !country ||
    !lead_team_id
  ) {
    res.status(400);
    throw new Error("All fields are required");
  }

  const getTeam = await MapTeam.findOne({ where: { team_id } });
  if (getTeam) {
    res.status(400);
    throw new Error("Team already exists");
  }
  await sequelize.sync({ alter: true });
  const newMapTeam = await MapTeam.create({
    team_id,
    designation,
    department,
    location,
    state,
    country,
    lead_team_id,
  });

  if (!newMapTeam) {
    res.status(400);
    throw new Error("Map Team not created");
  }

  res.status(201).json({
    message: "Map Team created successfully",
    data: newMapTeam,
  });
});

//@dec get MapTeam by Designation
//@route POST /user/MapTeams/byDesignation/:designation
//@access public
const getMapTeamsByDesignation = asyncHandler(async (req, res) => {
  const { designation } = req.params;

  const teams = await MapTeam.findAll({ where: { designation } });

  if (teams.length === 0) {
    res.status(404);
    throw new Error("No teams found for this designation");
  }

  res.status(200).json([
    {
      designation,
      teams: teams.map((team) => ({
        id: team.id,
        team_id: team.team_id,
        location: team.location,
        state: team.state,
        country: team.country,
        designation: team.designation,
        department: team.department,
        ref_team_id: team.lead_team_id,
        team_created_date: team.team_created_date,
      })),
    },
  ]);
});

//@dec get MapTeam by Designation
//@route POST /user/getMapTeams/ByDepartment/:department
//@access public
const getMapTeamsByDepartment = asyncHandler(async (req, res) => {
  const { department } = req.params;

  const teams = await MapTeam.findAll({ where: { department } });

  if (teams.length === 0) {
    res.status(404);
    throw new Error("No teams found for this department");
  }

  res.status(200).json([
    {
      department,
      teams: teams.map((team) => ({
        id: team.id,
        team_id: team.team_id,
        location: team.location,
        state: team.state,
        country: team.country,
        designation: team.designation,
        department: team.department,
        ref_team_id: team.lead_team_id,
        team_created_date: team.team_created_date,
      })),
    },
  ]);
});

//@dec create team profit share
//@route POST /user/MapTeams/ProfitShare/create
//@access public
const createTeamProfitShare = asyncHandler(async (req, res) => {
  const { team_id, profit_share, team_profit_share } = req.body;
  if (!team_id || !profit_share || !team_profit_share) {
    res.status(400);
    throw new Error("All fields are required");
  }
  const getTeam = await MapTeam.findByPk(team_id);
  if (!getTeam) {
    res.status(400);
    throw new Error("Team not found");
  }
  await sequelize.sync({ alter: true });
  await MapTeamProfitShare.create({
    team_id,
    profit_share,
    team_profit_share,
  });
  const getUpdatedTeam = await MapTeamProfitShare.findOne({
    where: { team_id },
    include: [
      {
        model: MapTeam,
        as: "MapTeam",
      },
    ],
  });
  res.status(201).json({
    success: true,
    status: 201,
    message: "Team profit share created successfully",
    data: getUpdatedTeam,
  });
});

//@dec create team profit share
//@route POST /user/MapTeams/getProfitShare/create
//@access public
const getAllTeamsProfitShare = asyncHandler(async (req, res) => {
  const { from_date, to_date } = req.params;
  if (!from_date || !to_date) {
    return res
      .status(400)
      .json({ message: "from_date and to_date are required" });
  }
  const fromDate = new Date(from_date);
  const toDate = new Date(to_date);
  toDate.setHours(23, 59, 59, 999);
  // Fetch data from the database
  const profitShares = await MapTeamProfitShare.findAll({
    where: {
      profit_share_date: {
        [Op.between]: [fromDate, toDate],
      },
    },
  });
  // Format response
  const response = [
    {
      from_date,
      to_date,
      team_profit_shares: profitShares.map((share) => ({
        id: share.id,
        team_id: share.team_id,
        location: share.location,
        profit_share: share.profit_share,
        team_profit_share: share.team_profit_share,
        profit_share_date: share.profit_share_date,
      })),
    },
  ];
  res.status(200).json({
    success: true,
    status: 200,
    message: "Team profit shares fetched successfully",
    data: response,
  });
});

module.exports = {
  createMapTeam,
  getMapTeamsByDesignation,
  getMapTeamsByDepartment,
  createTeamProfitShare,
  getAllTeamsProfitShare,
};
