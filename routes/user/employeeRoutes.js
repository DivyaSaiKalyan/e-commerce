const express = require("express");
const {
  createEmployee,
  updateEmployee,
  getEmployeeById,
  getAllEmployees,
} = require("../../controllers/user/employeeController");
const router = express.Router();

router.post("/create", createEmployee);
router.put("/update/:emp_id", updateEmployee);
router.post("/getbyid/:id", getEmployeeById);
router.get("/all", getAllEmployees);

module.exports = router;
