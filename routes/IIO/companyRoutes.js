const express = require("express");
const {
  createCompany,
  createCompanyService,
  createCompanyProgressLog,
  createTreasuryFundsTransfer,
  updateCompany,
  getAll,
} = require("../../controllers/IIO/companyController");
const router = express.Router();

router.route("/create").post(createCompany);
router.route("/service/create").post(createCompanyService);
router.route("/progressLog/create").post(createCompanyProgressLog);
router.route("/fundsTransfer/create").post(createTreasuryFundsTransfer);
router.route("/update/:id").put(updateCompany);
router.route("/all").get(getAll);

module.exports = router;
