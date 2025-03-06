const express = require("express");
const {
  createMapTeam,
  getMapTeamsByDesignation,
  getMapTeamsByDepartment,
  createTeamProfitShare,
  getAllTeamsProfitShare,
} = require("../../controllers/user/mapTeamController");

const router = express.Router();

router.post("/create", createMapTeam);
router.post("/byDesignation/:designation", getMapTeamsByDesignation);
router.post("/ByDepartment/:department", getMapTeamsByDepartment);
router.post("/ProfitShare/create", createTeamProfitShare);
router.post("/getProfitShare/:from_date/:to_date", getAllTeamsProfitShare);

module.exports = router;
