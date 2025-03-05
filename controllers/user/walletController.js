const asyncHandler = require("express-async-handler");
const { sequelize } = require("../../config/dbConnection");
const Wallet = require("../../models/User/wallet");
const User = require("../../models/User/user");

//@dec create Wallet
//@route POST /user/wallet/create
//@access public
const createWallet = asyncHandler(async (req, res) => {
  const { user_id, symbol, quantity, quantity_hold, stock_profits } = req.body;

  if (!user_id || !symbol || !quantity) {
    res.status(400);
    throw new Error("All fields are required");
  }

  // Check if user exists
  const user = await User.findOne({ where: { user_id } });
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  await sequelize.sync({ alter: true });
  const newWallet = await Wallet.create({
    user_id,
    symbol,
    quantity,
    quantity_hold,
    stock_profits,
  });

  res.status(201).json({
    message: "Wallet created successfully",
    statusCode: 201,
    success: true,
    data: newWallet,
  });
});

//@dec update Wallet
//@route PUT /user/wallet/update/:id
//@access public
const updateWallet = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { symbol, quantity, quantity_hold, stock_profits } = req.body;

  const wallet = await Wallet.findByPk(id);
  if (!wallet) {
    res.status(404);
    throw new Error("Wallet not found");
  }

  wallet.symbol = symbol || wallet.symbol;
  wallet.quantity = quantity || wallet.quantity;
  wallet.quantity_hold = quantity_hold || wallet.quantity_hold;
  wallet.stock_profits = stock_profits || wallet.stock_profits;
  wallet.updated_date = new Date();

  await wallet.save();

  res.json({
    statusCode: 200,
    success: true,
    message: "Wallet updated successfully",
    data: wallet,
  });
});

//@dec get Wallet by id
//@route POST /user/wallet/getbyid/:id
//@access public
const getWalletById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const wallet = await Wallet.findByPk(id, {
    include: [
      {
        model: User,
        as: "User",
      },
    ],
  });
  if (!wallet) {
    res.status(404);
    throw new Error("Wallet not found");
  }

  res.json({
    message: "Wallet fetched successfully",
    statusCode: 200,
    success: true,
    data: wallet,
  });
});

//@dec get Wallet by user id
//@route POST /user/wallet/getbyuserid/:user_id
//@access public
const getWalletByUserId = asyncHandler(async (req, res) => {
  const { user_id } = req.params;

  const user = await User.findOne({ where: { user_id } });
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const wallets = await Wallet.findAll({ where: { user_id } });

  res.json([
    {
      user_id,
      wallets: wallets.map((wallet) => ({
        id: wallet.id,
        symbol: wallet.symbol,
        quantity: wallet.quantity,
        quantity_hold: wallet.quantity_hold,
        stock_profits: wallet.stock_profits,
        created_date: wallet.created_date,
        updated_date: wallet.updated_date,
      })),
    },
  ]);
});

module.exports = {
  createWallet,
  updateWallet,
  getWalletById,
  getWalletByUserId,
};
