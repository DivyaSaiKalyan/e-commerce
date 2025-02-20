const express = require("express");
const router = express.Router();
const {
  createItemCatalogue,
  updateItemCatalogue,
  getItemByItemCode,
} = require("../controllers/itemCatalogueController");

router.route("/create").post(createItemCatalogue);
router.route("/update/:item_code").put(updateItemCatalogue);
router.route("/get/:item_code").get(getItemByItemCode);

module.exports = router;
