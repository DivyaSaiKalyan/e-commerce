const express = require("express");
const {
  createProductCatalogue,
  createProductAndItemCatalogue,
  updateProductCatalogue,
  getProductByProductCode,
  getProductsByCategory,
} = require("../../controllers/productCatalogue/productCatalogueController");
const router = express.Router();

router.route("/create").post(createProductCatalogue);
router.route("/second/create").post(createProductAndItemCatalogue);
router.route("/update/:product_code").put(updateProductCatalogue);
router.route("/get/:product_code").post(getProductByProductCode);
router.route("/getproducts/:category_code").post(getProductsByCategory);

module.exports = router;
