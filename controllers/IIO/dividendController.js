const asyncHandler = require("express-async-handler");
const { Op } = require("sequelize");
const Dividend = require("../../models/IIO/dividend");
const Company = require("../../models/IIO/company");
const { sequelize } = require("../../config/dbConnection");
const User = require("../../models/User/user");

// @desc Create a new Dividend
// @route POST /dividend/create
// @access Public
const createDividend = asyncHandler(async (req, res) => {
  const { company_code, user_id, dividend_amount, category } = req.body;

  if (!company_code || !user_id || !dividend_amount || !category) {
    res.status(400);
    throw new Error("All fields are required");
  }

  const getCompany = await Company.findOne({ where: { id: company_code } });
  if (!getCompany) {
    res.status(404);
    throw new Error("Company not found");
  }
  const getUser = await User.findOne({ where: { user_id } });
  if (!getUser) {
    res.status(404);
    throw new Error("User not found");
  }

  await sequelize.sync({ alter: true });
  const newDividend = await Dividend.create({
    category,
    company_code,
    user_id,
    dividend_amount,
  });

  res.status(201).json({
    status: "success",
    message: "Dividend created successfully",
    statusCode: 201,
    data: newDividend,
  });
});

// @desc Get Dividends by Company Code
// @route GET /dividend/company/:company_code
// @access Public
const getDividendsByCompany = asyncHandler(async (req, res) => {
  const { company_code } = req.params;

  const dividends = await Dividend.findAll({
    where: { company_code },
    include: [{ model: Company, as: "Company" }],
  });

  if (dividends.length === 0) {
    return res
      .status(404)
      .json({ message: "No dividends found for this company" });
  }

  const response = {
    company_code: dividends[0].company_code,
    company_name: dividends[0].Company.company_name,
    dividend_date: dividends[0].dividend_date,
    dividends: dividends.map((div) => ({
      id: div.id,
      user_id: div.user_id,
      dividend_amount: div.dividend_amount,
    })),
  };

  res.status(200).json({
    status: "success",
    message: "Dividends fetched successfully",
    statusCode: 200,
    data: [response],
  });
});

// @desc Get Dividends by User ID
// @route GET /dividend/user/:user_id
// @access Public
const getDividendsByUserId = asyncHandler(async (req, res) => {
  const { user_id } = req.params;

  const dividends = await Dividend.findAll({
    where: { user_id },
    include: [{ model: Company, as: "Company" }],
  });

  if (dividends.length === 0) {
    return res
      .status(404)
      .json({ message: "No dividends found for this user" });
  }

  const response = dividends.map((div) => ({
    id: div.id,
    company_code: div.company_code,
    company_name: div.Company.company_name,
    dividend_amount: div.dividend_amount,
    dividend_date: div.dividend_date,
    user_id: div.user_id,
  }));

  res.status(200).json({
    status: "success",
    message: "Dividends fetched successfully",
    statusCode: 200,
    data: response,
  });
});

module.exports = {
  createDividend,
  getDividendsByCompany,
  getDividendsByUserId,
};
