const express = require("express");
const router = express.Router();

const {
  createJobExperience,
  updateJobExperience,
  getJobExperienceById,
  getJobExperienceProfilesByUserId,
} = require("../../controllers/user/jobExperienceController");

router.route("/create").post(createJobExperience);
router.route("/update/:id").put(updateJobExperience);
router.route("/getById/:id").post(getJobExperienceById);
router.route("/getByUserId/:user_id").post(getJobExperienceProfilesByUserId);

module.exports = router;
