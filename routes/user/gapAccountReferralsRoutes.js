const express = require("express");
const {
  createGapAccountReferral,
  updateGapAccountReferral,
  getGapAccountReferralById,
  getGapAccountReferralsByUserId,
} = require("../../controllers/user/gapAccountReferralsController");
const router = express.Router();

router.route("/create").post(createGapAccountReferral);
router.route("/update/:id").put(updateGapAccountReferral);
router.route("/getGapAccountReferralbyid/:id").post(getGapAccountReferralById);
router
  .route("/getGapAccountReferralsByUserId/:user_id")
  .post(getGapAccountReferralsByUserId);

module.exports = router;
