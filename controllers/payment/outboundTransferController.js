const asyncHandler = require("express-async-handler");
const { sequelize } = require("../../config/dbConnection");
const OutboundTransaction = require("../../models/Payment/outboundTransactions");
const User = require("../../models/user");
const Recipient = require("../../models/Payment/recipient");

//@dec create createOutboundTransfer
//@route POST /bank/createOutboundTransfer
//@access public
const createOutboundTransfer = asyncHandler(async (req, res) => {
  const {
    transfer_type,
    transfer_user_id,
    recipient_id,
    transfer_currency,
    transfer_amount,
    receive_currency,
    receive_amount,
    exchange_rate,
    transaction_fees,
    trans_agent_user_id,
    transfer_order_accepted_date,
    transfer_order_confirmed_date,
    transfer_receipt_image,
    transfer_status,
    transfer_purpose,
  } = req.body;

  if (
    !transfer_type ||
    !transfer_user_id ||
    !recipient_id ||
    !transfer_currency ||
    !transfer_amount ||
    !receive_currency ||
    !receive_amount ||
    !trans_agent_user_id
  ) {
    res.status(400);
    throw new Error("All fields are required");
  }

  await sequelize.sync({ alter: true });
  const createOutboundTransfer = await OutboundTransaction.create({
    transfer_type,
    transfer_user_id,
    recipient_id,
    transfer_currency,
    transfer_amount,
    receive_currency,
    receive_amount,
    exchange_rate,
    transaction_fees,
    trans_agent_user_id,
    transfer_order_accepted_date,
    transfer_order_confirmed_date,
    transfer_receipt_image,
    transfer_status,
    transfer_purpose,
  });

  if (!createOutboundTransfer) {
    res.status(400);
    throw new Error("Outbound Transfer not created");
  }

  const outboundTransfer = await OutboundTransaction.findOne({
    where: { id: createOutboundTransfer.id },
    include: [
      {
        model: User,
        as: "User",
      },
      {
        model: Recipient,
        as: "Recipient",
      },
    ],
  });

  if (!outboundTransfer) {
    res.status(400);
    throw new Error("Outbound Transfer not found");
  }

  res.status(200).json({
    success: true,
    message: "Outbound Transfer created successfully",
    statusCode: 200,
    data: outboundTransfer,
  });
});

//@dec create updateOutboundTransfer
//@route PUT /bank/updateOutboundTransfer
//@access public
const updateOutboundTransfer = asyncHandler(async (req, res) => {
  const {
    transfer_type,
    transfer_user_id,
    recipient_id,
    transfer_currency,
    transfer_amount,
    receive_currency,
    receive_amount,
    exchange_rate,
    transaction_fees,
    trans_agent_user_id,
    transfer_order_accepted_date,
    transfer_order_confirmed_date,
    transfer_receipt_image,
    transfer_status,
    transfer_purpose,
  } = req.body;
  const { id } = req.params;

  if (!id) {
    res.status(400);
    throw new Error("Outbound Transfer id is required");
  }

  await sequelize.sync({ alter: true });
  const getOutboundTransfer = await OutboundTransaction.findOne({
    where: { id },
  });

  if (!getOutboundTransfer) {
    res.status(400);
    throw new Error("Outbound Transfer not found");
  }

  const updateOutboundTransfer = await OutboundTransaction.update(
    {
      transfer_type: transfer_type || getOutboundTransfer.transfer_type,
      transfer_user_id:
        transfer_user_id || getOutboundTransfer.transfer_user_id,
      recipient_id: recipient_id || getOutboundTransfer.recipient_id,
      transfer_currency:
        transfer_currency || getOutboundTransfer.transfer_currency,
      transfer_amount: transfer_amount || getOutboundTransfer.transfer_amount,
      receive_currency:
        receive_currency || getOutboundTransfer.receive_currency,
      receive_amount: receive_amount || getOutboundTransfer.receive_amount,
      exchange_rate: exchange_rate || getOutboundTransfer.exchange_rate,
      transaction_fees:
        transaction_fees || getOutboundTransfer.transaction_fees,
      trans_agent_user_id:
        trans_agent_user_id || getOutboundTransfer.trans_agent_user_id,
      transfer_order_accepted_date:
        transfer_order_accepted_date ||
        getOutboundTransfer.transfer_order_accepted_date,
      transfer_order_confirmed_date:
        transfer_order_confirmed_date ||
        getOutboundTransfer.transfer_order_confirmed_date,
      transfer_receipt_image:
        transfer_receipt_image || getOutboundTransfer.transfer_receipt_image,
      transfer_status: transfer_status || getOutboundTransfer.transfer_status,
      transfer_purpose:
        transfer_purpose || getOutboundTransfer.transfer_purpose,
    },
    {
      where: { id },
    }
  );

  if (!updateOutboundTransfer) {
    res.status(400);
    throw new Error("Outbound Transfer not updated");
  }

  const outboundTransfer = await OutboundTransaction.findOne({
    where: { id },
    include: [
      {
        model: User,
        as: "User",
      },
      {
        model: Recipient,
        as: "Recipient",
      },
    ],
  });

  if (!outboundTransfer) {
    res.status(400);
    throw new Error("Outbound Transfer not found");
  }

  res.status(200).json({
    success: true,
    message: "Outbound Transfer updated successfully",
    statusCode: 200,
    data: outboundTransfer,
  });
});

//@dec create getOutboundTransferById
//@route POST /bank/getOutboundTransferById
//@access public
const getOutboundTransferById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    res.status(400);
    throw new Error("Outbound Transfer id is required");
  }

  const getOutboundTransfer = await OutboundTransaction.findOne({
    where: { id },
    include: [
      {
        model: User,
        as: "User",
      },
      {
        model: Recipient,
        as: "Recipient",
      },
    ],
  });

  if (!getOutboundTransfer) {
    res.status(400);
    throw new Error("Outbound Transfer not found");
  }

  res.status(200).json({
    success: true,
    message: "Outbound Transfer found successfully",
    statusCode: 200,
    data: getOutboundTransfer,
  });
});

//@dec create getOutboundTransfersByUser
//@route POST /bank/getOutboundTransfersByUser
//@access public
const getOutboundTransfersByUser = asyncHandler(async (req, res) => {
  const { user_id } = req.params;

  if (!user_id) {
    res.status(400);
    throw new Error("User id is required");
  }

  const outboundTransfers = await OutboundTransaction.findAll({
    where: { transfer_user_id: user_id },
    include: [
      {
        model: User,
        as: "User",
      },
      {
        model: Recipient,
        as: "Recipient",
      },
    ],
  });

  if (!outboundTransfers || outboundTransfers.length === 0) {
    res.status(400);
    throw new Error("Outbound Transfers not found");
  }

  // Grouping logic for transfer_type
  const groupedTransfers = outboundTransfers.reduce((acc, transfer) => {
    const { transfer_type, transfer_status, ...rest } = transfer.toJSON();

    let transferGroup = acc.find((t) => t.transfer_type === transfer_type);
    if (!transferGroup) {
      transferGroup = { transfer_type, transfers: [] };
      acc.push(transferGroup);
    }

    let statusGroup = transferGroup.transfers.find(
      (t) => t.transfer_status === transfer_status
    );
    if (!statusGroup) {
      statusGroup = { transfer_status, list: [] };
      transferGroup.transfers.push(statusGroup);
    }

    statusGroup.list.push(rest);
    return acc;
  }, []);

  res.status(200).json({
    success: true,
    message: "Outbound Transfers found successfully",
    statusCode: 200,
    data: groupedTransfers,
  });
});

//@dec create getOutboundTransfersByTransAgent
//@route POST /bank/getOutboundTransfersByTransAgent
//@access public
const getOutboundTransfersByTransAgent = asyncHandler(async (req, res) => {
  const { transfer_type } = req.params;

  if (!transfer_type) {
    res.status(400);
    throw new Error("Transfer type is required");
  }

  const outboundTransfers = await OutboundTransaction.findAll({
    where: { transfer_type },
    include: [
      {
        model: User,
        as: "User",
      },
      {
        model: Recipient,
        as: "Recipient",
      },
    ],
  });

  if (!outboundTransfers || outboundTransfers.length === 0) {
    res.status(400);
    throw new Error("Outbound Transfers not found");
  }

  // Grouping logic by `transfer_type` and `transfer_status`
  const groupedTransfers = outboundTransfers.reduce((acc, transfer) => {
    const { transfer_status, Recipient, ...rest } = transfer.toJSON();

    const transferGroup = acc.find((t) => t.transfer_type === transfer_type);
    if (!transferGroup) {
      acc.push({ transfer_type, transfers: [] });
    }

    const statusGroup = acc
      .find((t) => t.transfer_type === transfer_type)
      .transfers.find((t) => t.transfer_status === transfer_status);
    if (!statusGroup) {
      acc
        .find((t) => t.transfer_type === transfer_type)
        .transfers.push({ transfer_status, list: [] });
    }

    acc
      .find((t) => t.transfer_type === transfer_type)
      .transfers.find((t) => t.transfer_status === transfer_status)
      .list.push({
        id: rest.id,
        transfer_date: rest.transfer_date,
        bank_name: Recipient?.bank_name || null,
        account_number: Recipient?.account_number || null,
        account_holder_name: Recipient?.account_holder_name || null,
        currency: Recipient?.currency || rest.transfer_currency,
        amount: rest.transfer_amount,
        transfer_confirmed_date: rest.transfer_confirmed_date,
        transfer_receipt_image: rest.transfer_receipt_image,
      });

    return acc;
  }, []);

  res.status(200).json({
    success: true,
    message: "Outbound Transfers found successfully",
    statusCode: 200,
    data: groupedTransfers,
  });
});

module.exports = {
  createOutboundTransfer,
  updateOutboundTransfer,
  getOutboundTransferById,
  getOutboundTransfersByUser,
  getOutboundTransfersByTransAgent,
};
