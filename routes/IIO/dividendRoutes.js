const express = require("express");
const {
  createDividend,
  getDividendsByCompany,
  getDividendsByUserId,
} = require("../../controllers/IIO/dividendController");
const router = express.Router();

router.post("/create", createDividend);
router.get("/company/:company_code", getDividendsByCompany);
router.get("/user/:user_id", getDividendsByUserId);

module.exports = router;
