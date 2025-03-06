const express = require("express");
const {
  createItemCatalogue,
  updateItemCatalogue,
  getItemByItemCode,
} = require("../../controllers/ItemCatalogue/itemCatalogueController");
const router = express.Router();

router.route("/create").post(createItemCatalogue);
router.route("/update/:item_code").put(updateItemCatalogue);
router.route("/get/:item_code").post(getItemByItemCode);

module.exports = router;
