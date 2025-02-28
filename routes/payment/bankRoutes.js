const express = require("express");
const {
  createBank,
  updateBank,
  getBankById,
  getBanksByBankType,
  getBanksByCurrencyCode,
  getAccountDetails,
} = require("../../controllers/payment/bankController");
const router = express.Router();

router.route("/create/:user_id").post(createBank);
router.route("/update/:bank_id").put(updateBank);
router.route("/getBankById/:bank_id").post(getBankById);
router.route("/getBankByBankType/:bank_type").post(getBanksByBankType);
router
  .route("/getBanksByCurrencyCode/:currency_code")
  .post(getBanksByCurrencyCode);
router.route("/getAccountDetails/:bank_id/:user_id").post(getAccountDetails);

module.exports = router;
