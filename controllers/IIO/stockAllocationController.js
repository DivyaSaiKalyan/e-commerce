const asyncHandler = require("express-async-handler");
const { sequelize } = require("../../config/dbConnection");
const StockAllocation = require("../../models/IIO/stockAllocation");
const Company = require("../../models/IIO/company");
const User = require("../../models/User/user");
const UserStockAllocation = require("../../models/IIO/userStockAllocation");

// @desc Create Stock Allocation
// @route POST /stockAllocation/create
// @access Public
const createStockAllocation = asyncHandler(async (req, res) => {
  const {
    company_code,
    category,
    source_of_allocation,
    stock_allocation,
    stock_consume,
    stock_available,
    locking_period_in_months,
    user_id,
    trans_type,
    units,
    stock_price,
  } = req.body;

  if (
    !company_code ||
    !source_of_allocation ||
    !stock_allocation ||
    !stock_consume ||
    !locking_period_in_months ||
    !user_id ||
    !trans_type ||
    !units ||
    !stock_price
  ) {
    res.status(400);
    throw new Error("All required fields must be provided");
  }

  await sequelize.sync({ alter: true });
  const newStockAllocation = await StockAllocation.create({
    company_code,
    source_of_allocation,
    category,
    stock_allocation,
    stock_consume,
    stock_available,
    locking_period_in_months,
  });

  if (!newStockAllocation) {
    res.status(400);
    throw new Error("Stock Allocation not created");
  }

  totalCostOfStocks = units * stock_price;
  const createUserStockAllocations = await UserStockAllocation.create({
    user_id,
    company_code,
    trans_type,
    units,
    stock_price,
    total_value: totalCostOfStocks,
  });

  if (!createUserStockAllocations) {
    res.status(400);
    throw new Error("User Stock Allocation not created");
  }

  res.status(201).json({
    status: "success",
    message: "Stock Allocation created successfully",
    statusCode: 201,
    data: {
      newStockAllocation: newStockAllocation,
      createUserStockAllocations: createUserStockAllocations,
    },
  });
});

// @desc Update Stock Allocation
// @route PUT /stockAllocation/update/:id
// @access Public
const updateStockAllocation = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    stock_alloc_date,
    category,
    source_of_allocation,
    stock_allocation,
    stock_consume,
    stock_available,
    locking_period_in_months,
  } = req.body;

  const existingStockAllocation = await StockAllocation.findByPk(id);
  if (!existingStockAllocation) {
    return res.status(404).json({ error: "Stock Allocation not found" });
  }

  await existingStockAllocation.update({
    stock_alloc_date:
      stock_alloc_date || existingStockAllocation.stock_alloc_date,
    source_of_allocation:
      source_of_allocation || existingStockAllocation.source_of_allocation,
    category: category || existingStockAllocation.category,
    stock_allocation:
      stock_allocation || existingStockAllocation.stock_allocation,
    stock_consume: stock_consume || existingStockAllocation.stock_consume,
    stock_available: stock_available || existingStockAllocation.stock_available,
    location_period_in_months:
      locking_period_in_months ||
      existingStockAllocation.locking_period_in_months,
    updated_date: new Date(),
  });

  const updatedStockAllocation = await StockAllocation.findOne({
    where: { id },
    include: [
      {
        model: Company,
        as: "Company",
      },
    ],
  });

  res.status(200).json({
    message: "Stock Allocation updated successfully",
    statusCode: 200,
    success: true,
    data: updatedStockAllocation,
  });
});

// @desc Get Stock Allocation by ID
// @route GET /stockAllocation/:id
// @access Public
const getStockAllocationById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const stockAllocation = await StockAllocation.findOne({
    where: { id },
    include: [
      {
        model: Company,
        as: "Company",
      },
    ],
  });
  if (!stockAllocation) {
    return res.status(404).json({ message: "Stock Allocation not found" });
  }

  res.status(200).json({
    status: "success",
    message: "Stock Allocation fetched successfully",
    statusCode: 200,
    data: stockAllocation,
  });
});

// @desc Get Stock Allocations by Company Code
// @route GET /stockAllocation/company/:company_code
// @access Public
const getStockAllocationByCompanyCode = asyncHandler(async (req, res) => {
  const { company_code } = req.params;

  const stockAllocations = await StockAllocation.findAll({
    where: { company_code },
    include: [
      {
        model: Company,
        as: "Company",
      },
    ],
  });

  if (stockAllocations.length === 0) {
    return res
      .status(404)
      .json({ message: "No stock allocations found for this company" });
  }

  res.status(200).json({
    status: "success",
    message: "Stock Allocations fetched successfully",
    statusCode: 200,
    data: stockAllocations,
  });
});

// @desc Get List of All Stock Allocations
// @route GET /stockAllocation/list
// @access Public
const listStockAllocations = asyncHandler(async (req, res) => {
  const stockAllocations = await StockAllocation.findAll();

  if (stockAllocations.length === 0) {
    return res.status(404).json({ message: "No stock allocations found" });
  }

  res.status(200).json({
    status: "success",
    message: "Stock Allocations fetched successfully",
    statusCode: 200,
    data: stockAllocations,
  });
});

// @desc Get User Stock Allocations by User ID
// @route GET /stockAllocation/user/:user_id
// @access Public
const getUserStockAllocationsByUserId = asyncHandler(async (req, res) => {
  const { user_id } = req.params;

  const stockAllocations = await UserStockAllocation.findAll({
    where: { user_id },
    include: [
      {
        model: Company,
        as: "Company",
      },
      {
        model: User,
        as: "User",
      },
    ],
  });

  if (stockAllocations.length === 0) {
    return res
      .status(404)
      .json({ message: "No stock allocations found for this user" });
  }

  res.status(200).json({
    status: "success",
    message: "User Stock Allocations fetched successfully",
    statusCode: 200,
    data: stockAllocations,
  });
});

module.exports = {
  createStockAllocation,
  updateStockAllocation,
  getStockAllocationById,
  getStockAllocationByCompanyCode,
  listStockAllocations,
  getUserStockAllocationsByUserId,
};
