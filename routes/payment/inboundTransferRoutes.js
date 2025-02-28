const express = require("express");
const {
  createInboundTransfer,
  updateInboundTransfer,
  getInboundTransferById,
  getInboundTransfersByUserId,
  getInboundTransfersByTransAgent,
} = require("../../controllers/payment/inboundTransferController");
const router = express.Router();

router.route("/createInboundTransfer/").post(createInboundTransfer);
router.route("/updateInboundTransfer/:id").put(updateInboundTransfer);
router.route("/getInboundTransferById/:id").post(getInboundTransferById);
router
  .route("/getInboundTransfersByUserId/:user_id")
  .post(getInboundTransfersByUserId);
router
  .route("/getInboundTransfersByTransAgent/:trans_agent_user_id")
  .post(getInboundTransfersByTransAgent);

module.exports = router;
