const express = require("express");
const {
  createOutboundTransfer,
  updateOutboundTransfer,
  getOutboundTransferById,
  getOutboundTransfersByUser,
  getOutboundTransfersByTransAgent,
} = require("../../controllers/payment/outboundTransferController");
const router = express.Router();

router.route("/createOutboundTransfer/").post(createOutboundTransfer);
router.route("/updateOutboundTransfer/:id").put(updateOutboundTransfer);
router.route("/getOutboundTransferById/:id").post(getOutboundTransferById);
router
  .route("/getOutboundTransfersByUser/:user_id")
  .post(getOutboundTransfersByUser);
router
  .route("/getOutboundTransfersByTransAgent/:transfer_type")
  .post(getOutboundTransfersByTransAgent);

module.exports = router;
