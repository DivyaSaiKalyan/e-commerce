const asyncHandler = require("express-async-handler");
const { sequelize } = require("../../config/dbConnection");
const WalletTransaction = require("../../models/Payment/walletTransactions");
const User = require("../../models/user");

//@dec create createWalletTransfer
//@route POST /bank/createWalletTransfer
//@access public
const createWalletTransfer = asyncHandler(async (req, res) => {
  const {
    transfer_type,
    sub_transfer_type,
    transfer_logo_path,
    transfer_user_id,
    receive_user_id,
    trans_agent_user_id,
    transfer_currency,
    transfer_amount,
    transaction_ref_no,
    loyalty_coins,
    receipt_image_path,
  } = req.body;

  if (
    !transfer_type ||
    !sub_transfer_type ||
    !transfer_logo_path ||
    !transfer_user_id ||
    !receive_user_id ||
    !trans_agent_user_id ||
    !transfer_currency ||
    !transfer_amount ||
    !transaction_ref_no
  ) {
    res.status(400);
    throw new Error("All fields are required");
  }

  await sequelize.sync({ alter: true });

  const walletTransfer = await WalletTransaction.create({
    transfer_type,
    sub_transfer_type,
    transfer_logo_path,
    transfer_user_id,
    receive_user_id,
    trans_agent_user_id,
    transfer_currency,
    transfer_amount,
    transaction_ref_no,
    loyalty_coins,
    receipt_image_path,
  });

  if (!walletTransfer) {
    res.status(400);
    throw new Error("Wallet Transfer not created");
  }

  const walletTransactions = await WalletTransaction.findOne({
    where: {
      id: walletTransfer.id,
    },
    include: [
      {
        model: User,
        as: "User",
      },
    ],
  });

  res.status(200).json({
    success: true,
    message: "Wallet Transfer created successfully",
    statusCode: 200,
    data: walletTransactions,
  });
});

//@dec create updateWalletTransfer
//@route PUT /bank/updateWalletTransfer
//@access public
const updateWalletTransfer = asyncHandler(async (req, res) => {
  const {
    transfer_type,
    sub_transfer_type,
    transfer_logo_path,
    transfer_user_id,
    receive_user_id,
    trans_agent_user_id,
    transfer_currency,
    transfer_amount,
    transaction_ref_no,
    loyalty_coins,
    receipt_image_path,
  } = req.body;
  const { id } = req.params;
  const getWalletTransfer = await WalletTransaction.findByPk(id);
  if (!getWalletTransfer) {
    res.status(400);
    throw new Error("Wallet Transfer not found");
  }

  await getWalletTransfer.update(
    {
      transfer_type: transfer_type || getWalletTransfer.transfer_type,
      sub_transfer_type:
        sub_transfer_type || getWalletTransfer.sub_transfer_type,
      transfer_logo_path:
        transfer_logo_path || getWalletTransfer.transfer_logo_path,
      transfer_user_id: transfer_user_id || getWalletTransfer.transfer_user_id,
      receive_user_id: receive_user_id || getWalletTransfer.receive_user_id,
      trans_agent_user_id:
        trans_agent_user_id || getWalletTransfer.trans_agent_user_id,
      transfer_currency:
        transfer_currency || getWalletTransfer.transfer_currency,
      transfer_amount: transfer_amount || getWalletTransfer.transfer_amount,
      transaction_ref_no:
        transaction_ref_no || getWalletTransfer.transaction_ref_no,
      loyalty_coins: loyalty_coins || getWalletTransfer.loyalty_coins,
      receipt_image_path:
        receipt_image_path || getWalletTransfer.receipt_image_path,
    },
    {
      where: {
        id: id,
      },
    }
  );
  const walletTransactions = await WalletTransaction.findOne({
    where: {
      id: id,
    },
  });

  res.status(200).json({
    success: true,
    message: "Wallet Transfer updated successfully",
    statusCode: 200,
    data: walletTransactions,
  });
});

//@dec create getWalletTransferById
//@route POST /bank/getWalletTransferById
//@access public
const getWalletTransferById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    res.status(400);
    throw new Error("All fields are required");
  }
  const getWalletTransfer = await WalletTransaction.findOne({
    where: {
      id,
    },
    include: [
      {
        model: User,
        as: "User",
      },
    ],
  });
  if (!getWalletTransfer) {
    res.status(400);
    throw new Error("Wallet Transfer not found");
  }
  res.status(200).json({
    success: true,
    statusCode: 200,
    message: "Wallet Transfer found successfully",
    data: getWalletTransfer,
  });
});

//@dec create getWalletTransactionsByUserId
//@route POST /bank/getWalletTransactionsByUserId
//@access public
const getWalletTransactionsByUserId = asyncHandler(async (req, res) => {
  const { user_id } = req.params;
  if (!user_id) {
    res.status(400);
    throw new Error("All fields are required");
  }
  const walletTransactions = await WalletTransaction.findAll({
    where: {
      transfer_user_id: user_id,
    },
    include: [
      {
        model: User,
        as: "User",
      },
    ],
  });
  if (!walletTransactions || walletTransactions.length === 0) {
    res.status(400);
    throw new Error("Wallet Transactions not found");
  }

  // Format the response structure
  const formattedResponse = [
    {
      transfer_type: "Inbound",
      transfer_logo_path: "logo123.png",
      sub_transfer_types: [
        {
          sub_transfer_type: "Transfer",
          list: [
            {
              transaction_status: "New",
              list: [
                {
                  transfers: walletTransactions.map((transaction) => ({
                    id: transaction.id,
                    transaction_date: transaction.transaction_date,
                    receive_user_id: transaction.receive_user_id,
                    trans_agent_user_id: transaction.trans_agent_user_id,
                    transfer_currency: transaction.transfer_currency,
                    transfer_amount: transaction.transfer_amount,
                    loyalty_coins: transaction.loyalty_coins,
                    transaction_ref_no: transaction.transaction_ref_no,
                    receipt_image_path: transaction.receipt_image_path || null,
                    updated_date: transaction.updated_date || null,
                  })),
                  receives: walletTransactions.map((transaction) => ({
                    id: transaction.id,
                    transaction_date: transaction.transaction_date,
                    receive_user_id: transaction.receive_user_id,
                    trans_agent_user_id: transaction.trans_agent_user_id,
                    transfer_currency: transaction.transfer_currency,
                    transfer_amount: transaction.transfer_amount,
                    loyalty_coins: transaction.loyalty_coins,
                    transaction_ref_no: transaction.transaction_ref_no,
                    receipt_image_path: transaction.receipt_image_path || null,
                    updated_date: transaction.updated_date || null,
                  })),
                },
              ],
            },
          ],
        },
      ],
    },
  ];

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: "Wallet Transactions found successfully",
    data: formattedResponse,
  });
});

module.exports = {
  createWalletTransfer,
  updateWalletTransfer,
  getWalletTransferById,
  getWalletTransactionsByUserId,
};
