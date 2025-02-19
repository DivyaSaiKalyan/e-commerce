const express = require("express");
const router = express.Router();
const {
  createItemCatalogue,
} = require("../controllers/itemCatalogueController");

router.route("/create").post(createItemCatalogue);

module.exports = router;
