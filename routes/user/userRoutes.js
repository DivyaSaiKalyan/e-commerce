const express = require("express");
const {
  createUser,
  updateUser,
  getUserByUserId,
  getAllUsers,
  loginUser,
} = require("../../controllers/user/userController");
const router = express.Router();

router.route("/create").post(createUser);
router.route("/login").post(loginUser);
router.route("/update/:user_id").put(updateUser);
router.route("/getUser/:user_id").post(getUserByUserId);
router.route("/getUsers/:from_date/:to_date").post(getAllUsers);

module.exports = router;
