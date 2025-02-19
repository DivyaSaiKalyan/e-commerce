const express = require("express");
const {
  createProductCatalogue,
} = require("../controllers/productCatalogueController");
const router = express.Router();

router.route("/create").post(createProductCatalogue);

module.exports = router;
