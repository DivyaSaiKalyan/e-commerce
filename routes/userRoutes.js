const express = require("express");
const { getDeliveryAddress } = require("../controllers/userController");
const router = express.Router();

router.route("/deliveryAddress/:user_id").post(getDeliveryAddress);

module.exports = router;
