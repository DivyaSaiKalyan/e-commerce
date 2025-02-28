const express = require("express");
const {
  createMobileTransfer,
  getMobileTransfersByUserId,
} = require("../../controllers/payment/mobileTransferController");
const router = express.Router();

router.route("/createMobileTransfer/").post(createMobileTransfer);
router
  .route("/getMobileTransfersByUserId/:user_id")
  .post(getMobileTransfersByUserId);

module.exports = router;
