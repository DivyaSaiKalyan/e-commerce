const express = require("express");
const {
  createEducation,
  updateEducation,
  getEducationById,
  getEducationProfilesByUserId,
} = require("../../controllers/user/educationController");
const router = express.Router();

router.route("/create").post(createEducation);
router.route("/update/:id").put(updateEducation);
router.route("/getById/:id").post(getEducationById);
router.route("/getByUserId/:user_id").post(getEducationProfilesByUserId);

module.exports = router;
