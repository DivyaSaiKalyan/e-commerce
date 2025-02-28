const express = require("express");
const {
  createCashCenter,
  updateCashCenter,
  getCashCentersByAreaCode,
  getAllCashCenters,
} = require("../../controllers/payment/cashCenterController");
const router = express.Router();

router.route("/createCashCenter/").post(createCashCenter);
router.route("/updateCashCenter/:cash_center_id").put(updateCashCenter);
router
  .route("/getCashCentersByAreaCode/:area_code")
  .post(getCashCentersByAreaCode);
router.route("/getAllCashCenters").get(getAllCashCenters);

module.exports = router;
