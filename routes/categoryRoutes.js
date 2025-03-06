const express = require("express");
const {
  createCategory,
  updateCategory,
  getCategoryByCategoryCode,
  getAllCategories,
} = require("../controllers/category/categoryController");
const router = express.Router();

router.route("/create").post(createCategory);
router.route("/update/:category_code").put(updateCategory);
router.route("/get/:category_code").post(getCategoryByCategoryCode);
router.route("/get").post(getAllCategories);

module.exports = router;
