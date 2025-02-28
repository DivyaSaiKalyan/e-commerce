const express = require("express");
const {
  createStoreInventory,
  updateStoreInventory,
} = require("../controllers/storeInventoryController");
const router = express.Router();

router.route("/createstoreinventory").post(createStoreInventory);
router.route("/updatestoreinventory/:store_id").put(updateStoreInventory);

module.exports = router;
