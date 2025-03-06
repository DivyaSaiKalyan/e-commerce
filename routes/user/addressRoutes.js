const express = require("express");
const {
  createAddress,
  updateAddress,
  getAddressById,
  getDeliveryAddress,
} = require("../../controllers/user/addressController");
const router = express.Router();

router.route("/create").post(createAddress);
router.route("/getbyuser/:user_id").post(getDeliveryAddress);
router.route("/update/:user_id/:id").put(updateAddress);
router.route("/getbyid/:id").post(getAddressById);

module.exports = router;
