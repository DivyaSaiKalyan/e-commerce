const express = require("express");
const {
  createStockAllocation,
  updateStockAllocation,
  getStockAllocationById,
  getStockAllocationByCompanyCode,
  listStockAllocations,
  getUserStockAllocationsByUserId,
} = require("../../controllers/IIO/stockAllocationController");
const router = express.Router();

router.route("/create").post(createStockAllocation);
router.route("/update/:id").put(updateStockAllocation);
router.route("/:id").post(getStockAllocationById);
router.route("/company/:company_code").post(getStockAllocationByCompanyCode);
router.route("/list").get(listStockAllocations);
router.route("/user/:user_id").post(getUserStockAllocationsByUserId);

module.exports = router;
