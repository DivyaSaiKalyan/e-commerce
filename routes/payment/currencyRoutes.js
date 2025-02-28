const express = require("express");
const {
  createCurrencyTable,
  updateCurrencyTable,
  getCurrencyTableById,
  getCurrencyTableByCurrencyRange,
  getCurrencyTable,
} = require("../../controllers/payment/currencyController");
const router = express.Router();

router.route("/createCurrencyTable/").post(createCurrencyTable);
router.route("/updateCurrencyTable/:id/").put(updateCurrencyTable);
router.route("/getCurrencyTableById/:id/").post(getCurrencyTableById);
router
  .route("/getCurrencyTableByCurrencyRange/:from_currency/:to_currency")
  .post(getCurrencyTableByCurrencyRange);
router.route("/getCurrencyTable").get(getCurrencyTable);

module.exports = router;
