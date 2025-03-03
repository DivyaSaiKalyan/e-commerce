const express = require("express");
const router = express.Router();
const {
  createStartupIdea,
  updateStartupIdea,
  getStartupIdeasByUserId,
  getAll,
} = require("../../controllers/IIO/startupIdeaController");

router.route("/create").post(createStartupIdea);
router.route("/update/:id").put(updateStartupIdea);
router.route("/user/:user_id").post(getStartupIdeasByUserId);
router.route("/all").get(getAll);

module.exports = router;
