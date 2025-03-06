const express = require("express");
const {
  createProduction,
  updateProduction,
  createProductionMaterial,
  createQualityInspection,
  getProductionByBatchNo,
} = require("../../controllers/production/productionController");
const router = express.Router();

router.route("/create").post(createProduction);
router.route("/update/:id").put(updateProduction);
router.route("/materialcreate").post(createProductionMaterial);
router.route("/qualityinspection/create").post(createQualityInspection);
router.route("/get/:batch_number").post(getProductionByBatchNo);

module.exports = router;
