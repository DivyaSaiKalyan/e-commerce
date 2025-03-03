const express = require("express");
const {
  createInvestment,
  getInvestmentsByCompany,
  getInvestmentsByUserId,
} = require("../../controllers/IIO/investmentController");
const router = express.Router();

router.post("/create", createInvestment);
router.get("/company/:company_code", getInvestmentsByCompany);
router.get("/user/:user_id", getInvestmentsByUserId);

module.exports = router;
