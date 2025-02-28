const express = require("express");
const router = express.Router();
const {
  createStore,
  getStoreByUserId,
  getStoreByStoreId,
  getStoresByAreaCode,
  getStoresByStoreType,
} = require("../controllers/storeController");

router.route("/creatstore").post(createStore);
router.route("/getstorebyuserid/:user_id").post(getStoreByUserId);
router.route("/getstorebystoreid/:store_id").post(getStoreByStoreId);
router.route("/getstorebyareacode/:area_code").post(getStoresByAreaCode);
router.route("/getstorebystoretype/:store_type").post(getStoresByStoreType);

module.exports = router;
