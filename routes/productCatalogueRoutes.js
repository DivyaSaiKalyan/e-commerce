const express = require("express");
const {
  createProductCatalogue,
  updateProductCatalogue,
  getProductByProductCode,
  getProductsByCategory,
} = require("../controllers/productCatalogueController");
const router = express.Router();

router.route("/create").post(createProductCatalogue);
router.route("/update/:product_code").put(updateProductCatalogue);
router.route("/get/:product_code").get(getProductByProductCode);
router.route("/getproducts/:category_code").get(getProductsByCategory);

module.exports = router;
