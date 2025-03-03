const asyncHandler = require("express-async-handler");
const { sequelize } = require("../../config/dbConnection");
const { Op } = require("sequelize");
const VGCTreasury = require("../../models/IIO/vgcTreasury");
const Ledger = require("../../models/IIO/ledger");
const VdcStockValue = require("../../models/IIO/vdcStockValue");
const VdcPrice = require("../../models/IIO/vdcPrice");
const Company = require("../../models/IIO/company");

// @desc Create VGC Treasury
// @route POST /vgc/treasury/create
// @access Public
const createVGCTreasury = asyncHandler(async (req, res) => {
  const { new_coins, total_coins } = req.body;
  if (!new_coins || (!total_coins && total_coins !== 0)) {
    res.status(400);
    throw new Error("All fields are required");
  }
  await sequelize.sync({ alter: true });
  const newTreasury = await VGCTreasury.create({
    transaction_date: new Date(),
    new_coins,
    total_coins,
  });

  res.status(201).json({
    status: "success",
    message: "VGC Treasury created successfully",
    statusCode: 201,
    data: newTreasury,
  });
});

// @desc Update VGC Treasury
// @route PUT /vgc/treasury/update/:id
// @access Public
const updateVGCTreasury = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { new_coins, total_coins } = req.body;

  const treasury = await VGCTreasury.findByPk(id);
  if (!treasury) {
    res.status(404);
    throw new Error("VGC Treasury not found");
  }

  treasury.new_coins = new_coins || treasury.new_coins;
  treasury.total_coins = total_coins || treasury.total_coins;
  await treasury.save();

  res.status(200).json({
    status: "success",
    message: "VGC Treasury updated successfully",
    statusCode: 200,
    data: treasury,
  });
});

// @desc Get VGC Treasury
// @route GET /vgc/treasury
// @access Public
const getVGCTreasury = asyncHandler(async (req, res) => {
  const treasuryData = await VGCTreasury.findAll();

  const response = treasuryData.map((treasury) => ({
    transaction_date: treasury.transaction_date,
    coins_data: [
      {
        id: treasury.id,
        new_coins: treasury.new_coins,
        total_coins: treasury.total_coins,
        transaction_date: treasury.transaction_date,
      },
    ],
  }));

  res.status(200).json({
    status: "success",
    message: "VGC Treasury data fetched successfully",
    statusCode: 200,
    data: response,
  });
});

// @desc Create Ledger Entry
// @route POST /ledger/create
// @access Public
const createLedger = asyncHandler(async (req, res) => {
  const { company_code, ledger_amount, total_amount, growth_value } = req.body;

  if (!company_code || !ledger_amount || !total_amount || !growth_value) {
    res.status(400);
    throw new Error("All fields are required");
  }

  await sequelize.sync({ alter: true });

  const newLedger = await Ledger.create({
    ledger_date: new Date(),
    company_code,
    ledger_amount,
    total_amount,
    growth_value,
  });
  const getNewLedger = await Ledger.findOne({
    where: {
      id: newLedger.id,
    },
    include: [
      {
        model: Company,
        as: "Company",
      },
    ],
  });
  res.status(201).json({
    status: "success",
    message: "Ledger entry created successfully",
    statusCode: 201,
    data: getNewLedger,
  });
});

// @desc Get All Ledger Entries within Date Range
// @route GET /ledger/:from_date/:to_date
// @access Public
const getAllLedgers = asyncHandler(async (req, res) => {
  const { from_date, to_date } = req.params;
  const startDate = new Date(from_date);
  const endDate = new Date(to_date);
  endDate.setHours(23, 59, 59, 999);

  const ledgers = await Ledger.findAll({
    where: {
      ledger_date: {
        [Op.between]: [startDate, endDate],
      },
    },
  });

  const response = ledgers.map((ledger) => ({
    company_name: "sky tech",
    ledger_data: [
      {
        id: ledger.id,
        company_code: ledger.company_code,
        ledger_amount: ledger.ledger_amount,
        total_amount: ledger.total_amount,
        growth_value: ledger.growth_value,
        ledger_date: ledger.ledger_date,
      },
    ],
  }));

  res.status(200).json({
    status: "success",
    message: "Ledger data fetched successfully",
    statusCode: 200,
    data: response,
  });
});

// @desc Create VDC Stock Value
// @route POST /vdc/stock-value/create
// @access Public
const createVdcStockValue = asyncHandler(async (req, res) => {
  const { company_code, est_stock_units, est_stock_price } = req.body;

  if (!company_code || !est_stock_units || !est_stock_price) {
    res.status(400);
    throw new Error("All fields are required");
  }

  await sequelize.sync({ alter: true });
  const est_stock_total_value = est_stock_units * est_stock_price;

  const newStockValue = await VdcStockValue.create({
    stock_value_date: new Date(),
    company_code,
    est_stock_units,
    est_stock_price,
    est_stock_total_value: est_stock_total_value,
  });
  const getNewStockValue = await VdcStockValue.findOne({
    where: {
      id: newStockValue.id,
    },
    include: [
      {
        model: Company,
        as: "Company",
      },
    ],
  });

  res.status(201).json({
    status: "success",
    message: "VDC Stock Value created successfully",
    statusCode: 201,
    data: getNewStockValue,
  });
});

// @desc Get VDC Stock Value by Date
// @route GET /vdc/stock-value/:date
// @access Public
const getStockValueByDate = asyncHandler(async (req, res) => {
  const { date } = req.params;
  const formateDate = new Date(date);
  formateDate.setHours(23, 59, 59, 999);

  const stockValues = await VdcStockValue.findAll({
    where: { stock_value_date: new Date(formateDate) },
  });

  res.status(200).json({
    status: "success",
    message: "VDC Stock Value fetched successfully",
    statusCode: 200,
    data: stockValues,
  });
});

// @desc Create VDC Price
// @route POST /vdc/price/create
// @access Public
const createVdcPrice = asyncHandler(async (req, res) => {
  const {
    ledger_amount,
    est_stocks_amount,
    stocks_sale_amount,
    total_vgc_units,
    vdc_price,
  } = req.body;

  if (
    !ledger_amount ||
    !est_stocks_amount ||
    !stocks_sale_amount ||
    !total_vgc_units ||
    !vdc_price
  ) {
    res.status(400);
    throw new Error("All fields are required");
  }

  await sequelize.sync({ alter: true });
  const totalAmount = ledger_amount + est_stocks_amount + stocks_sale_amount;

  const newVdcPrice = await VdcPrice.create({
    vdc_price_date: new Date(),
    ledger_amount,
    est_stocks_amount,
    stocks_sale_amount,
    total_amount: totalAmount,
    total_vgc_units,
    vdc_price,
  });

  res.status(201).json({
    status: "success",
    message: "VDC Price created successfully",
    statusCode: 201,
    data: newVdcPrice,
  });
});

// @desc Get VDC Price
// @route GET /vdc/price
// @access Public
const getVdcPrice = asyncHandler(async (req, res) => {
  const prices = await VdcPrice.findAll();
  if (!prices || prices.length === 0) {
    res.status(404);
    throw new Error("VDC Price not found");
  }
  res.status(200).json({
    status: "success",
    message: "VDC Prices fetched successfully",
    statusCode: 200,
    data: prices,
  });
});

module.exports = {
  createVGCTreasury,
  updateVGCTreasury,
  getVGCTreasury,
  createLedger,
  getAllLedgers,
  createVdcStockValue,
  getStockValueByDate,
  createVdcPrice,
  getVdcPrice,
};
