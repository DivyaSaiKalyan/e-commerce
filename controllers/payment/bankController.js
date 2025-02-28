const asyncHandler = require("express-async-handler");
const { sequelize } = require("../../config/dbConnection");
const Bank = require("../../models/Payment/bank");
const User = require("../../models/user");

//@dec create bank
//@route POST /user/bank/create
//@access public
const createBank = asyncHandler(async (req, res) => {
  const { user_id } = req.params;
  const {
    currency_code,
    bank_type,
    bank_icon,
    bank_name,
    account_number,
    account_holder_name,
  } = req.body;

  if (
    !currency_code ||
    !bank_type ||
    !bank_icon ||
    !user_id ||
    !bank_name ||
    !account_number ||
    !account_holder_name
  ) {
    res.status(400);
    throw new Error("All fields are required");
  }

  await sequelize.sync({ alter: true });
  const bank = await Bank.create({
    user_id,
    currency_code,
    bank_type,
    bank_icon,
    bank_name,
    account_number,
    account_holder_name,
  });

  if (!bank) {
    res.status(400);
    throw new Error("Bank not created");
  }

  res.status(200).json({
    status: "success",
    message: "Bank created successfully",
    statusCode: 200,
    data: bank,
  });
});

//@dec update bank
//@route POST /user/bank/update
//@access public
const updateBank = asyncHandler(async (req, res) => {
  const { bank_id } = req.params;
  const {
    currency_code,
    bank_type,
    bank_icon,
    bank_name,
    account_number,
    account_holder_name,
  } = req.body;

  if (!bank_id) {
    res.status(400);
    throw new Error("All fields are required");
  }

  await sequelize.sync({ alter: true });
  const getBankDetails = await Bank.findOne({
    where: {
      bank_id: bank_id,
    },
  });

  if (!getBankDetails) {
    res.status(400);
    throw new Error("Bank not found");
  }

  const updatedBankDetails = await Bank.update(
    {
      currency_code: currency_code || getBankDetails.currency_code,
      bank_type: bank_type || getBankDetails.bank_type,
      bank_icon: bank_icon || getBankDetails.bank_icon,
      bank_name: bank_name || getBankDetails.bank_name,
      account_number: account_number || getBankDetails.account_number,
      account_holder_name:
        account_holder_name || getBankDetails.account_holder_name,
    },
    {
      where: {
        bank_id: bank_id,
      },
    }
  );

  if (!updatedBankDetails) {
    res.status(400);
    throw new Error("Bank not updated");
  }
  const getUpdateBank = await getBank("bank_id", bank_id);

  res.status(200).json({
    status: "success",
    message: "Bank updated successfully",
    statusCode: 200,
    data: getUpdateBank,
  });
});

//@dec get bank by id
//@route POST /user/bank/getBankById/:bank_id
//@access public
const getBankById = asyncHandler(async (req, res) => {
  const { bank_id } = req.params;
  const bank = await getBank("bank_id", bank_id);
  if (!bank) {
    res.status(400);
    throw new Error("Bank not found");
  }
  res.status(200).json({
    status: "success",
    message: "Bank found successfully",
    statusCode: 200,
    data: bank,
  });
});

//@dec get bank by bank type
//@route POST /user/bank/getBankByBankType/:bank_id
//@access public
const getBanksByBankType = asyncHandler(async (req, res) => {
  const { bank_type } = req.params;
  const banks = await getBank("bank_type", bank_type);
  if (!banks || banks.length === 0) {
    res.status(400);
    throw new Error("Bank not found");
  }
  // Group banks by currency_code
  const groupedBanks = banks.reduce((acc, bank) => {
    let currencyGroup = acc.find(
      (group) => group.currency === bank.currency_code
    );
    if (!currencyGroup) {
      currencyGroup = { currency: bank.currency_code, banks: [] };
      acc.push(currencyGroup);
    }
    currencyGroup.banks.push({
      id: bank.id,
      created_date: new Date(bank.created_date).toLocaleDateString("en-GB"), // Format date (DD-MM-YYYY)
      bank_name: bank.bank_name,
      account_number: bank.account_number,
      account_holder_name: bank.account_holder_name,
    });
    return acc;
  }, []);

  // Send response
  res.status(200).json({
    status: "success",
    message: "Banks found successfully",
    statusCode: 200,
    bank_types: groupedBanks, // Structured response
  });
});

//@dec get bank by currency
//@route POST /user/bank/getBanksByCurrency/:currency_code
//@access public
const getBanksByCurrencyCode = asyncHandler(async (req, res) => {
  const { currency_code } = req.params;
  const banks = await getBank("currency_code", currency_code);
  if (!banks || banks.length === 0) {
    res.status(400);
    throw new Error("Bank not found");
  }
  // Group banks by bank_type
  const groupedBanks = banks.reduce((acc, bank) => {
    let bankTypeGroup = acc.find((group) => group.bank_type === bank.bank_type);
    if (!bankTypeGroup) {
      bankTypeGroup = { bank_type: bank.bank_type, banks: [] };
      acc.push(bankTypeGroup);
    }
    bankTypeGroup.banks.push({
      id: bank.id,
      created_date: new Date(bank.created_date).toLocaleDateString("en-GB"), // Format date (DD-MM-YYYY)
      bank_name: bank.bank_name,
      account_number: bank.account_number,
      account_holder_name: bank.account_holder_name,
    });
    return acc;
  }, []);

  // Send response
  res.status(200).json({
    status: "success",
    message: "Banks found successfully",
    statusCode: 200,
    currencies: groupedBanks, // Structured response
  });
});

//get back
const getBank = async (field, value) => {
  let bank;
  if (field === "bank_id") {
    bank = await Bank.findAll({
      where: {
        bank_id: value,
      },
    });
  } else if (field === "bank_type") {
    bank = await Bank.findAll({
      where: {
        bank_type: value,
      },
    });
  } else if (field === "currency_code") {
    bank = await Bank.findAll({
      where: {
        currency_code: value,
      },
    });
  }
  return bank;
};

//@dec get bank accound details by bank id and user id
//@route POST /user/bank/getAccountDetails/:bank_id/:user_id
//@access public
const getAccountDetails = asyncHandler(async (req, res) => {
  const { bank_id, user_id } = req.params;
  const getBankDetails = await Bank.findAll({
    where: {
      bank_id: bank_id,
      user_id: user_id,
    },
    include: [
      {
        model: User,
        as: "User",
      },
    ],
  });

  if (!getBankDetails) {
    res.status(400);
    throw new Error("Bank not found");
  }

  res.status(200).json({
    status: "success",
    message: "Bank found successfully",
    statusCode: 200,
    data: getBankDetails,
  });
});

module.exports = {
  createBank,
  updateBank,
  getBankById,
  getBanksByBankType,
  getBanksByCurrencyCode,
  getAccountDetails,
};
