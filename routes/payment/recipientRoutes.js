const express = require("express");
const {
  createRecipient,
  updateRecipient,
  getRecipientById,
  getRecipientsByUserId,
} = require("../../controllers/payment/recipientController");
const router = express.Router();

router.route("/createRecipient/").post(createRecipient);
router.route("/updateRecipient/:id").put(updateRecipient);
router.route("/getRecipientById/:id").post(getRecipientById);
router.route("/getRecipientsByUserId/:user_id").post(getRecipientsByUserId);

module.exports = router;
