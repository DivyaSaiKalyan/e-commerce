const asyncHandler = require("express-async-handler");
const { sequelize } = require("../../config/dbConnection");
const MobileTransfer = require("../../models/Payment/mobileTransfer");
const User = require("../../models/user");

//@dec create createMobileTransfer
//@route POST /bank/createMobileTransfer
//@access public
const createMobileTransfer = asyncHandler(async (req, res) => {
  const { transfer_type, transfer_user_id, receive_user_id, transfer_amount } =
    req.body;

  if (
    !transfer_type ||
    !transfer_user_id ||
    !receive_user_id ||
    !transfer_amount
  ) {
    res.status(400);
    throw new Error("All fields are required");
  }

  await sequelize.sync({ alter: true });
  const createMobileTransfer = await MobileTransfer.create({
    transfer_type,
    transfer_user_id,
    receive_user_id,
    transfer_amount,
  });

  if (!createMobileTransfer) {
    res.status(400);
    throw new Error("Mobile Transfer not created");
  }

  const updatedMobileTransfer = await MobileTransfer.findOne({
    where: { id: createMobileTransfer.id },
    include: [
      {
        model: User,
        as: "User",
      },
      {
        model: User,
        as: "User",
      },
    ],
  });

  res.status(201).json({
    status: "success",
    message: "Mobile Transfer created successfully",
    statusCode: 201,
    mobileTransfer: updatedMobileTransfer,
  });
});

//@dec create getMobileTransfersByUserId
//@route POST /bank/getMobileTransfersByUserId
//@access public
const getMobileTransfersByUserId = asyncHandler(async (req, res) => {
  const { user_id } = req.params;

  if (!user_id) {
    res.status(400);
    throw new Error("All fields are required");
  }

  await sequelize.sync({ alter: true });
  const mobileTransfers = await MobileTransfer.findAll({
    where: { transfer_user_id: user_id },
    include: [
      {
        model: User,
        as: "User",
      },
    ],
  });

  if (!mobileTransfers || mobileTransfers.length === 0) {
    res.status(400);
    throw new Error("Mobile Transfers not found");
  }

  res.status(200).json({
    status: "success",
    message: "Mobile Transfers found successfully",
    statusCode: 200,
    data: mobileTransfers,
  });
});

module.exports = { createMobileTransfer, getMobileTransfersByUserId };
