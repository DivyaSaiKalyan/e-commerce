const express = require("express");
const {
  createWalletTransfer,
  updateWalletTransfer,
  getWalletTransferById,
  getWalletTransactionsByUserId,
} = require("../../controllers/payment/walletTransferController");
const router = express.Router();

router.route("/createWalletTransfer").post(createWalletTransfer);
router.route("/updateWalletTransfer/:id").put(updateWalletTransfer);
router.route("/getWalletTransferById/:id").post(getWalletTransferById);
router
  .route("/getWalletTransactionsByUserId/:user_id")
  .post(getWalletTransactionsByUserId);

module.exports = router;
