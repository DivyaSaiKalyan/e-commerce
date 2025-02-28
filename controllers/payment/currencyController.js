const asyncHandler = require("express-async-handler");
const { sequelize } = require("../../config/dbConnection");
const CurrencyTable = require("../../models/Payment/currencyTable");

//@dec create CurrencyTable
//@route POST /bank/createCurrencyTable
//@access public
const createCurrencyTable = asyncHandler(async (req, res) => {
  const {
    from_currency,
    to_currency,
    exchange_rate,
    transaction_fees,
    from_currency_icon,
    to_currency_icon,
  } = req.body;

  if (
    !from_currency ||
    !to_currency ||
    !exchange_rate ||
    !transaction_fees ||
    !from_currency_icon ||
    !to_currency_icon
  ) {
    res.status(400);
    throw new Error("All fields are required");
  }

  await sequelize.sync({ alter: true });
  const currencyTable = await CurrencyTable.create({
    from_currency,
    to_currency,
    exchange_rate,
    transaction_fees,
    from_currency_icon,
    to_currency_icon,
  });

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: "Currency Table Created Successfully",
    data: currencyTable,
  });
});

//@dec update CurrencyTable
//@route POST /bank/updateCurrencyTable
//@access public
const updateCurrencyTable = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    from_currency,
    to_currency,
    exchange_rate,
    transaction_fees,
    from_currency_icon,
    to_currency_icon,
  } = req.body;

  if (!id) {
    res.status(400);
    throw new Error("All fields are required");
  }

  const getCurrencyTable = await CurrencyTable.findByPk(id);
  if (!getCurrencyTable) {
    res.status(400);
    throw new Error("Currency Table not found");
  }

  await sequelize.sync({ alter: true });
  const currencyTable = await CurrencyTable.update(
    {
      from_currency: from_currency || getCurrencyTable.from_currency,
      to_currency: to_currency || getCurrencyTable.to_currency,
      exchange_rate: exchange_rate || getCurrencyTable.exchange_rate,
      transaction_fees: transaction_fees || getCurrencyTable.transaction_fees,
      from_currency_icon:
        from_currency_icon || getCurrencyTable.from_currency_icon,
      to_currency_icon: to_currency_icon || getCurrencyTable.to_currency_icon,
    },
    {
      where: { id: id },
    }
  );
  if (!currencyTable) {
    res.status(400);
    throw new Error("Currency Table not found");
  }
  const getUpdatedCurrencyTable = await CurrencyTable.findByPk(id);
  res.status(200).json({
    success: true,
    statusCode: 200,
    message: "Currency Table Updated Successfully",
    data: getUpdatedCurrencyTable,
  });
});

//@dec get CurrencyTable by id
//@route POST /bank/getCurrencyTableById
//@access public
const getCurrencyTableById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const getCurrencyTable = await CurrencyTable.findByPk(id);
  if (!getCurrencyTable) {
    res.status(400);
    throw new Error("Currency Table not found");
  }
  res.status(200).json({
    success: true,
    statusCode: 200,
    message: "Currency Table found successfully",
    data: getCurrencyTable,
  });
});

//@dec get CurrencyTable by CurrencyRange
//@route POST /bank/getCurrencyTableByCurrencyRange
//@access public
const getCurrencyTableByCurrencyRange = asyncHandler(async (req, res) => {
  const { from_currency, to_currency } = req.params;
  if (!from_currency || !to_currency) {
    res.status(400);
    throw new Error("All fields are required");
  }
  const getCurrencyTable = await CurrencyTable.findAll({
    where: {
      from_currency: from_currency,
      to_currency: to_currency,
    },
  });
  if (!getCurrencyTable) {
    res.status(400);
    throw new Error("Currency Table not found");
  }
  res.status(200).json({
    success: true,
    statusCode: 200,
    message: "Currency Table found successfully",
    data: getCurrencyTable,
  });
});

//@dec get CurrencyTables
//@route GET /bank/CurrencyTables
//@access public
const getCurrencyTable = asyncHandler(async (req, res) => {
  const getCurrencyTable = await CurrencyTable.findAll();
  if (!getCurrencyTable) {
    res.status(400);
    throw new Error("Currency Table not found");
  }
  res.status(200).json({
    success: true,
    statusCode: 200,
    message: "Currency Table found successfully",
    data: getCurrencyTable,
  });
});

module.exports = {
  createCurrencyTable,
  updateCurrencyTable,
  getCurrencyTableById,
  getCurrencyTableByCurrencyRange,
  getCurrencyTable,
};
