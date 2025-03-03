const asyncHandler = require("express-async-handler");
const { sequelize } = require("../../config/dbConnection");
const StockOrder = require("../../models/IIO/stockOrder");
const StockTransfer = require("../../models/IIO/stockTransfer");
const User = require("../../models/User/user");

// @desc Create Stock Order
// @route POST /stock/order/create
// @access Public
const createStockOrder = asyncHandler(async (req, res) => {
  const { user_id, order_type, symbol, units, trans_type, stock_price } =
    req.body;

  if (
    !user_id ||
    !order_type ||
    !symbol ||
    !units ||
    !trans_type ||
    !stock_price
  ) {
    res.status(400);
    throw new Error("All fields are required");
  }

  await sequelize.sync({ alter: true });

  const newStockOrder = await StockOrder.create({
    stock_order_date: new Date(),
    user_id,
    order_type,
    symbol,
    units,
    trans_type,
    stock_price,
    stock_order_status: "Open",
  });

  const getStockOrder = await StockOrder.findOne({
    where: { id: newStockOrder.id },
    include: [
      {
        model: User,
        as: "User",
      },
    ],
  });

  res.status(201).json({
    status: "success",
    message: "Stock Order created successfully",
    statusCode: 201,
    data: getStockOrder,
  });
});

// @desc Get Stock Orders by Symbol and Order Type
// @route GET /stock/order/:symbol/:order_type
// @access Public
const getStockOrdersBySymbolAndOrderType = asyncHandler(async (req, res) => {
  const { symbol, order_type } = req.params;

  const stockOrders = await StockOrder.findAll({
    where: { symbol, order_type },
  });

  if (!stockOrders.length) {
    return res.status(404).json({
      message: "No stock orders found for this symbol and order type",
    });
  }

  res.status(200).json({
    status: "success",
    message: "Stock Orders fetched successfully",
    statusCode: 200,
    data: stockOrders,
  });
});

// @desc Create Stock Transfer
// @route POST /stock/transfer/create
// @access Public
const createStockTransfer = asyncHandler(async (req, res) => {
  const {
    buyer_user_id,
    seller_user_id,
    symbol,
    trans_type,
    stock_price,
    units,
  } = req.body;

  if (
    !buyer_user_id ||
    !seller_user_id ||
    !symbol ||
    !trans_type ||
    !stock_price ||
    !units
  ) {
    res.status(400);
    throw new Error("All fields are required");
  }
  const total_value = units * stock_price;

  await sequelize.sync({ alter: true });

  const newStockTransfer = await StockTransfer.create({
    stock_transfer_date: new Date(),
    buyer_user_id,
    seller_user_id,
    symbol,
    trans_type,
    stock_price,
    units,
    total_value: total_value,
  });

  res.status(201).json({
    status: "success",
    message: "Stock Transfer created successfully",
    statusCode: 201,
    data: newStockTransfer,
  });
});

// @desc Get Stock Transfers by Symbol
// @route GET /stock/transfer/:symbol
// @access Public
const getStockTransfersBySymbol = asyncHandler(async (req, res) => {
  const { symbol } = req.params;

  const stockTransfers = await StockTransfer.findAll({ where: { symbol } });

  if (!stockTransfers.length) {
    return res
      .status(404)
      .json({ message: "No stock transfers found for this symbol" });
  }

  res.status(200).json({
    status: "success",
    message: "Stock Transfers fetched successfully",
    statusCode: 200,
    data: stockTransfers,
  });
});

// @desc Get Portfolio by User ID
// @route GET /stock/portfolio/:user_id
// @access Public
const getPortfolioByUserId = asyncHandler(async (req, res) => {
  const { user_id } = req.params;

  const userPortfolio = await StockOrder.findAll({ where: { user_id } });

  if (!userPortfolio.length) {
    return res
      .status(404)
      .json({ message: "No portfolio found for this user" });
  }

  res.status(200).json({
    status: "success",
    message: "User portfolio fetched successfully",
    statusCode: 200,
    data: userPortfolio,
  });
});

module.exports = {
  createStockOrder,
  getStockOrdersBySymbolAndOrderType,
  createStockTransfer,
  getStockTransfersBySymbol,
  getPortfolioByUserId,
};
