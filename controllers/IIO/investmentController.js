const asyncHandler = require("express-async-handler");
const Investment = require("../../models/IIO/investment");

// @desc Create an Investment
// @route POST /investment/create
// @access Public
const createInvestment = asyncHandler(async (req, res) => {
  const { company_code, user_id, investment_amount, investment_date } =
    req.body;

  if (!company_code || !user_id || !investment_amount || !investment_date) {
    res.status(400);
    throw new Error("All fields are required");
  }

  const newInvestment = await Investment.create({
    company_code,
    user_id,
    investment_amount,
    investment_date,
  });

  res.status(201).json({
    status: "success",
    message: "Investment created successfully",
    statusCode: 201,
    data: newInvestment,
  });
});

// @desc Get Investments by Company Code
// @route GET /investment/company/:company_code
// @access Public
const getInvestmentsByCompany = asyncHandler(async (req, res) => {
  const { company_code } = req.params;

  const investments = await Investment.findAll({
    where: { company_code },
    include: [{ model: Company, as: "Company" }],
  });

  if (investments.length === 0) {
    return res
      .status(404)
      .json({ message: "No investments found for this company" });
  }

  const response = investments.map((inv) => ({
    id: inv.id,
    company_code: inv.company_code,
    company_name: inv.Company.company_name,
    investment_amount: inv.investment_amount,
    investment_date: inv.investment_date,
    user_id: inv.user_id,
  }));

  res.status(200).json({
    status: "success",
    message: "Investments fetched successfully",
    statusCode: 200,
    data: response,
  });
});

// @desc Get Investments by User ID
// @route GET /investment/user/:user_id
// @access Public
const getInvestmentsByUserId = asyncHandler(async (req, res) => {
  const { user_id } = req.params;

  const investments = await Investment.findAll({
    where: { user_id },
    include: [{ model: Company, as: "Company" }],
  });

  if (investments.length === 0) {
    return res
      .status(404)
      .json({ message: "No investments found for this user" });
  }

  const response = investments.map((inv) => ({
    id: inv.id,
    company_code: inv.company_code,
    company_name: inv.Company.company_name,
    investment_amount: inv.investment_amount,
    investment_date: inv.investment_date,
    user_id: inv.user_id,
  }));

  res.status(200).json({
    status: "success",
    message: "Investments fetched successfully",
    statusCode: 200,
    data: response,
  });
});

module.exports = {
  createInvestment,
  getInvestmentsByCompany,
  getInvestmentsByUserId,
};
