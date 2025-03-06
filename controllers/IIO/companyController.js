const asyncHandler = require("express-async-handler");
const { sequelize } = require("../../config/dbConnection");
const Company = require("../../models/IIO/company");
const AboutCompany = require("../../models/IIO/aboutCompany");
const CompanyServices = require("../../models/IIO/companyServices");
const CompanyProgressLog = require("../../models/IIO/companyProgressLog");
const TreasuryFundsTransfer = require("../../models/IIO/treasuryFundsTransfer");
const StartupIdea = require("../../models/IIO/startupIdea");

// @desc Create a Company
// @route POST /company/create
// @access Public
const createCompany = asyncHandler(async (req, res) => {
  const {
    startup_id,
    company_name,
    industry,
    symbol,
    stock_price,
    growth_value,
    company_logo_path,
    about_company,
  } = req.body;

  if (
    !startup_id ||
    !company_name ||
    !industry ||
    !symbol ||
    !stock_price ||
    !growth_value ||
    !about_company
  ) {
    res.status(400);
    throw new Error("All fields are required");
  }

  const getStartup = await StartupIdea.findByPk(startup_id);
  if (!getStartup) {
    res.status(400);
    throw new Error("Startup not found");
  }

  await sequelize.sync({ alter: true });
  const newCompany = await Company.create({
    startup_id,
    company_name,
    industry,
    symbol,
    stock_price,
    growth_value,
    company_logo_path,
  });
  const { id } = newCompany.dataValues;

  await sequelize.sync({ alter: true });
  const aboutCompany = await AboutCompany.create({
    company_code: id,
    about_company,
  });

  const getCompany = await Company.findOne({
    where: { id },
    include: [{ model: AboutCompany, as: "AboutCompany" }],
  });

  if (newCompany && aboutCompany) {
    res.status(201).json({
      status: "success",
      message: "Company and About Company created successfully",
      statusCode: 201,
      data: getCompany,
    });
  } else {
    res.status(400);
    throw new Error("Company not created");
  }
});

// @desc Create Company Service
// @route POST /company/service/create
// @access Public
const createCompanyService = asyncHandler(async (req, res) => {
  const {
    company_code,
    service_name,
    industry,
    about_service,
    service_icon_path,
  } = req.body;

  if (!company_code || !service_name || !industry || !about_service) {
    res.status(400);
    throw new Error("All fields are required");
  }

  await sequelize.sync({ alter: true });
  const companyService = await CompanyServices.create({
    company_code,
    service_name,
    industry,
    about_service,
    service_icon_path,
  });

  res.status(201).json({
    status: "success",
    message: "Company Service created successfully",
    statusCode: 201,
    data: companyService,
  });
});

// @desc Create Company Progress Log
// @route POST /company/progressLog/create
// @access Public
const createCompanyProgressLog = asyncHandler(async (req, res) => {
  const { company_code, department, progress_log } = req.body;

  if ((!company_code || !department, !progress_log)) {
    res.status(400);
    throw new Error("Company ID and Department are required");
  }

  await sequelize.sync({ alter: true });
  const progressLog = await CompanyProgressLog.create({
    company_code,
    department,
    progress_log,
  });
  const getProgressLog = await CompanyProgressLog.findOne({
    where: { id: progressLog.id },
    include: [
      {
        model: Company,
        as: "Company",
      },
    ],
  });

  res.status(201).json({
    status: "success",
    message: "Company Progress Log created successfully",
    statusCode: 201,
    data: getProgressLog,
  });
});

// @desc Create Treasury Funds Transfer
// @route POST /company/fundsTransfer/create
// @access Public
const createTreasuryFundsTransfer = asyncHandler(async (req, res) => {
  const { company_code, investment_amount } = req.body;

  if (!company_code || !investment_amount) {
    res.status(400);
    throw new Error("Company ID and Investment Amount are required");
  }

  await sequelize.sync({ alter: true });
  const fundsTransfer = await TreasuryFundsTransfer.create({
    company_code,
    investment_amount,
  });

  res.status(201).json({
    status: "success",
    message: "Treasury Funds Transfer created successfully",
    statusCode: 201,
    data: fundsTransfer,
  });
});

// @desc Update a Company
// @route PUT /company/update/:id
// @access Public
const updateCompany = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    company_name,
    industry,
    symbol,
    stock_price,
    iio_category,
    growth_value,
    company_status,
    company_logo_path,
  } = req.body;

  const existingCompany = await Company.findByPk(id);
  if (!existingCompany) {
    return res.status(404).json({ error: "Company not found" });
  }

  await existingCompany.update(
    {
      company_name: company_name || existingCompany.company_name,
      industry: industry || existingCompany.industry,
      symbol: symbol || existingCompany.symbol,
      iio_category: iio_category || existingCompany.iio_category,
      stock_price: stock_price || existingCompany.stock_price,
      growth_value: growth_value || existingCompany.growth_value,
      company_status: company_status || existingCompany.company_status,
      company_logo_path: company_logo_path || existingCompany.company_logo_path,
      updated_date: new Date(),
    },
    {
      where: {
        company_code: id,
      },
    }
  );

  const getUpdatedCompany = await Company.findOne({
    where: { id: existingCompany.id },
    include: [
      { model: AboutCompany, as: "AboutCompany" },
      { model: StartupIdea, as: "StartupIdea" },
      { model: CompanyProgressLog, as: "ProgressLogs" },
      { model: TreasuryFundsTransfer, as: "TreasuryTransfers" },
    ],
  });

  res.status(200).json({
    message: "Company updated successfully",
    statusCode: 200,
    success: true,
    data: getUpdatedCompany,
  });
});

// @desc Get All Companies Grouped by IIO Category
// @route GET /company/all
// @access Public
const getAll = asyncHandler(async (req, res) => {
  const companies = await Company.findAll({
    include: [
      { model: AboutCompany, as: "AboutCompany" },
      { model: CompanyServices, as: "Services" },
      { model: CompanyProgressLog, as: "ProgressLogs" },
      { model: TreasuryFundsTransfer, as: "TreasuryTransfers" },
    ],
  });

  if (companies.length === 0) {
    return res.status(404).json({ message: "No companies found" });
  }

  const groupedCompanies = companies.reduce((acc, company) => {
    const category = company.iio_category || "Unknown";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(company);
    return acc;
  }, {});

  const formattedResponse = Object.keys(groupedCompanies).map((category) => ({
    iio_category: category,
    startups: groupedCompanies[category],
  }));

  res.status(200).json({
    status: "success",
    message: "Companies fetched successfully",
    statusCode: 200,
    data: formattedResponse,
  });
});

module.exports = {
  createCompany,
  createCompanyService,
  createCompanyProgressLog,
  createTreasuryFundsTransfer,
  updateCompany,
  getAll,
};
