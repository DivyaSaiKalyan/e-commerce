const express = require("express");
const {
  createGapProfile,
  updateGapProfile,
  getGapProfileById,
  getGapProfileByUserId,
} = require("../../controllers/user/gapProfileController");
const router = express.Router();

router.route("/create").post(createGapProfile);
router.route("/update/:id").put(updateGapProfile);
router.route("/gapProfilebyid/:id").post(getGapProfileById);
router.route("/gapProfilebyuserid/:user_id").post(getGapProfileByUserId);

module.exports = router;
