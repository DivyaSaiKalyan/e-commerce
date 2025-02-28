const express = require("express");
const router = express.Router();
const {
  createCategory,
  updateCategory,
  getCategoryByCategoryCode,
  getAllCategories,
} = require("../controllers/categoryController");

router.route("/create").post(createCategory);
router.route("/update/:category_code").put(updateCategory);
router.route("/get/:category_code").post(getCategoryByCategoryCode);
router.route("/get").post(getAllCategories);

module.exports = router;
