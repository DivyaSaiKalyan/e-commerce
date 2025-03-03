const asyncHandler = require("express-async-handler");
const { sequelize } = require("../../config/dbConnection");
const InboundTransaction = require("../../models/Payment/inboundTransactions");
const User = require("../../models/User/user");

//@dec create createInboundTransfer
//@route POST /bank/createInboundTransfer
//@access public
const createInboundTransfer = asyncHandler(async (req, res) => {
  const {
    transfer_type,
    transfer_user_id,
    transfer_currency,
    transfer_amount,
    receive_currency,
    receive_amount,
    exchange_rate,
    transaction_fees,
    trans_agent_user_id,
    bank_name,
    account_number,
    account_holder_name,
    transfer_receipt_image,
    transfer_status,
  } = req.body;

  if (
    !transfer_type ||
    !transfer_user_id ||
    !transfer_currency ||
    !transfer_amount ||
    !trans_agent_user_id ||
    !bank_name ||
    !account_number ||
    !account_holder_name
  ) {
    res.status(400);
    throw new Error("All fields are required");
  }

  await sequelize.sync({ alter: true });

  const createInboundTransfer = await InboundTransaction.create({
    transfer_type,
    transfer_user_id,
    transfer_currency,
    transfer_amount,
    receive_currency,
    receive_amount,
    exchange_rate,
    transaction_fees,
    trans_agent_user_id,
    bank_name,
    account_number,
    account_holder_name,
    transfer_receipt_image,
    transfer_status,
  });

  if (!createInboundTransfer) {
    res.status(400);
    throw new Error("Inbound Transfer not created");
  }

  res.status(201).json({
    success: true,
    statusCode: 201,
    message: "Inbound Transfer created successfully",
    data: createInboundTransfer,
  });
});

//@dec create updateInboundTransfer
//@route PUT /bank/updateInboundTransfer
//@access public
const updateInboundTransfer = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    transfer_type,
    transfer_user_id,
    transfer_currency,
    transfer_amount,
    receive_currency,
    receive_amount,
    exchange_rate,
    transaction_fees,
    trans_agent_user_id,
    bank_name,
    account_number,
    account_holder_name,
    transfer_receipt_image,
    transfer_status,
  } = req.body;

  if (!id) {
    res.status(400);
    throw new Error("All fields are required");
  }
  const getInboundTransfer = await InboundTransaction.findByPk(id);
  if (!getInboundTransfer) {
    res.status(400);
    throw new Error("Inbound Transfer not found");
  }
  await sequelize.sync({ alter: true });
  const updatedInboundTransfer = await InboundTransaction.update(
    {
      transfer_type: transfer_type || getInboundTransfer.transfer_type,
      transfer_user_id: transfer_user_id || getInboundTransfer.transfer_user_id,
      transfer_currency:
        transfer_currency || getInboundTransfer.transfer_currency,
      transfer_amount: transfer_amount || getInboundTransfer.transfer_amount,
      receive_currency: receive_currency || getInboundTransfer.receive_currency,
      receive_amount: receive_amount || getInboundTransfer.receive_amount,
      exchange_rate: exchange_rate || getInboundTransfer.exchange_rate,
      transaction_fees: transaction_fees || getInboundTransfer.transaction_fees,
      trans_agent_user_id:
        trans_agent_user_id || getInboundTransfer.trans_agent_user_id,
      bank_name: bank_name || getInboundTransfer.bank_name,
      account_number: account_number || getInboundTransfer.account_number,
      account_holder_name:
        account_holder_name || getInboundTransfer.account_holder_name,
      transfer_receipt_image:
        transfer_receipt_image || getInboundTransfer.transfer_receipt_image,
      transfer_status: transfer_status || getInboundTransfer.transfer_status,
    },
    {
      where: {
        id,
      },
    }
  );
  if (!updatedInboundTransfer) {
    res.status(400);
    throw new Error("Inbound Transfer not updated");
  }
  const inboundTransfer = await InboundTransaction.findOne({
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
  if (!inboundTransfer) {
    res.status(400);
    throw new Error("Inbound Transfer not found");
  }
  res.status(200).json({
    success: true,
    statusCode: 200,
    message: "Inbound Transfer updated successfully",
    data: inboundTransfer,
  });
});

//@dec create getInboundTransferById
//@route POST /bank/getInboundTransferById
//@access public
const getInboundTransferById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    res.status(400);
    throw new Error("All fields are required");
  }
  const getInboundTransfer = await InboundTransaction.findOne({
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
  if (!getInboundTransfer) {
    res.status(400);
    throw new Error("Inbound Transfer not found");
  }
  res.status(200).json({
    success: true,
    statusCode: 200,
    message: "Inbound Transfer found successfully",
    data: getInboundTransfer,
  });
});

//@dec create getInboundTransfersByUserId
//@route POST /bank/getInboundTransfersByUserId
//@access public
const getInboundTransfersByUserId = asyncHandler(async (req, res) => {
  const { user_id } = req.params;
  if (!user_id) {
    res.status(400);
    throw new Error("All fields are required");
  }
  const inboundTransfers = await InboundTransaction.findAll({
    where: {
      transfer_user_id: user_id,
    },
  });
  if (!inboundTransfers || inboundTransfers.length === 0) {
    res.status(400);
    throw new Error("Inbound Transfers not found");
  }
  // Grouping logic by `transfer_type` and `transfer_status`
  const groupedTransfers = inboundTransfers.reduce((acc, transfer) => {
    const { transfer_status, Recipient, ...rest } = transfer.toJSON();

    const transferGroup = acc.find((t) => t.transfer_type === "UPI");
    if (!transferGroup) {
      acc.push({ transfer_type: "UPI", transfers: [] });
    }

    const statusGroup = acc
      .find((t) => t.transfer_type === "UPI")
      .transfers.find((t) => t.transfer_status === transfer_status);
    if (!statusGroup) {
      acc
        .find((t) => t.transfer_type === "UPI")
        .transfers.push({ transfer_status, list: [] });
    }

    acc
      .find((t) => t.transfer_type === "UPI")
      .transfers.find((t) => t.transfer_status === transfer_status)
      .list.push({
        id: rest.id,
        transfer_date: rest.transfer_date,
        recipient_id: Recipient?.bank_name || "Unknown",
        transfer_currency: rest.transfer_currency,
        transfer_amount: rest.transfer_amount,
        receive_currency: rest.receive_currency,
        receive_amount: rest.receive_amount,
        exchange_rate: rest.exchange_rate,
        transaction_fees: rest.transaction_fees,
        bank_name: Recipient?.bank_name || null,
        account_number: Recipient?.account_number || null,
        account_holder_name: Recipient?.account_holder_name || null,
        trans_agent_user_id: rest.trans_agent_user_id,
        transfer_order_accepted_date: rest.transfer_order_accepted_date,
        transfer_order_confirmed_date: rest.transfer_order_confirmed_date,
        transfer_receipt_image: rest.transfer_receipt_image,
      });

    return acc;
  }, []);

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: "Inbound Transfers found successfully",
    data: groupedTransfers,
  });
});

//@dec create getInboundTransfersByTransAgent
//@route POST /bank/getInboundTransfersByTransAgent
//@access public
const getInboundTransfersByTransAgent = asyncHandler(async (req, res) => {
  const { trans_agent_user_id } = req.params;
  if (!trans_agent_user_id) {
    res.status(400);
    throw new Error("All fields are required");
  }
  const inboundTransfers = await InboundTransaction.findAll({
    where: {
      trans_agent_user_id,
    },
  });
  if (!inboundTransfers || inboundTransfers.length === 0) {
    res.status(400);
    throw new Error("Inbound Transfers not found");
  }
  // Grouping logic by `transfer_type` and `transfer_status`
  const groupedTransfers = inboundTransfers.reduce((acc, transfer) => {
    const { transfer_status, Recipient, ...rest } = transfer.toJSON();

    const transferGroup = acc.find((t) => t.transfer_type === "UPI");
    if (!transferGroup) {
      acc.push({ transfer_type: "UPI", transfers: [] });
    }

    const statusGroup = acc
      .find((t) => t.transfer_type === "UPI")
      .transfers.find((t) => t.transfer_status === transfer_status);
    if (!statusGroup) {
      acc
        .find((t) => t.transfer_type === "UPI")
        .transfers.push({ transfer_status, list: [] });
    }

    acc
      .find((t) => t.transfer_type === "UPI")
      .transfers.find((t) => t.transfer_status === transfer_status)
      .list.push({
        id: rest.id,
        transfer_date: rest.transfer_date,
        bank_name: Recipient?.bank_name || "Unknown",
        account_number: Recipient?.account_number || null,
        account_holder_name: Recipient?.account_holder_name || null,
        currency: rest.transfer_currency,
        amount: rest.transfer_amount,
        transfer_confirmed_date: rest.transfer_order_confirmed_date || null,
        transfer_receipt_image: rest.transfer_receipt_image || null,
      });

    return acc;
  }, []);

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: "Inbound Transfers found successfully",
    data: groupedTransfers,
  });
});

module.exports = {
  createInboundTransfer,
  updateInboundTransfer,
  getInboundTransferById,
  getInboundTransfersByUserId,
  getInboundTransfersByTransAgent,
};
