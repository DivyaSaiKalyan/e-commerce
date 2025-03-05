const express = require("express");
const {
  createWallet,
  updateWallet,
  getWalletById,
  getWalletByUserId,
} = require("../../controllers/user/walletController");
const router = express.Router();

router.route("/create").post(createWallet);
router.route("/update/:id").put(updateWallet);
router.route("/getbyid/:id").post(getWalletById);
router.route("/getbyuserid/:user_id").post(getWalletByUserId);

module.exports = router;
