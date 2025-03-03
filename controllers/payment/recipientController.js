const asyncHandler = require("express-async-handler");
const { sequelize } = require("../../config/dbConnection");
const Recipient = require("../../models/Payment/recipient");
const User = require("../../models/User/user");

//@dec create createRecipient
//@route POST /bank/createRecipient
//@access public
const createRecipient = asyncHandler(async (req, res) => {
  const {
    user_id,
    recipient_type,
    recipient_name,
    currency_code,
    bank_name,
    account_number,
    account_holder_name,
    mobile_number,
  } = req.body;

  if (
    !user_id ||
    !recipient_type ||
    !recipient_name ||
    !currency_code ||
    !bank_name ||
    !account_number ||
    !account_holder_name ||
    !mobile_number
  ) {
    res.status(400);
    throw new Error("All fields are required");
  }

  await sequelize.sync({ alter: true });
  const createRecipient = await Recipient.create({
    user_id,
    recipient_type,
    recipient_name,
    currency_code,
    bank_name,
    account_number,
    account_holder_name,
    mobile_number,
  });

  if (!createRecipient) {
    res.status(400);
    throw new Error("Recipient not created");
  }
  const recipient = await Recipient.findOne({
    where: { id: createRecipient.id },
    include: [{ model: User, as: "User" }],
  });
  if (!recipient) {
    res.status(400);
    throw new Error("Recipient not found");
  }

  res.status(201).json({
    status: "success",
    message: "Recipient created successfully",
    statusCode: 201,
    data: recipient,
  });
});

//@dec create updateRecipient
//@route POST /bank/updateRecipient
//@access public
const updateRecipient = asyncHandler(async (req, res) => {
  const {
    user_id,
    recipient_type,
    recipient_name,
    currency_code,
    bank_name,
    account_number,
    account_holder_name,
    mobile_number,
  } = req.body;
  const { id } = req.params;

  if (!id) {
    res.status(400);
    throw new Error("All fields are required");
  }

  const recipient = await Recipient.findByPk(id);
  if (!recipient) {
    res.status(400);
    throw new Error("Recipient not found");
  }

  await sequelize.sync({ alter: true });
  const updateRecipient = await Recipient.update(
    {
      user_id: user_id || recipient.user_id,
      recipient_type: recipient_type || recipient.recipient_type,
      recipient_name: recipient_name || recipient.recipient_name,
      currency_code: currency_code || recipient.currency_code,
      bank_name: bank_name || recipient.bank_name,
      account_number: account_number || recipient.account_number,
      account_holder_name: account_holder_name || recipient.account_holder_name,
      mobile_number: mobile_number || recipient.mobile_number,
    },
    {
      where: {
        id: id,
      },
    }
  );

  if (!updateRecipient) {
    res.status(400);
    throw new Error("Recipient not updated");
  }
  const getUpdatedRecipient = await Recipient.findOne({
    where: {
      id: id,
    },
    include: [
      {
        model: User,
        as: "User",
      },
    ],
  });

  res.status(200).json({
    status: "success",
    message: "Recipient updated successfully",
    statusCode: 200,
    data: getUpdatedRecipient,
  });
});

//@dec create getRecipientById
//@route POST /bank/getRecipientById
//@access public
const getRecipientById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    res.status(400);
    throw new Error("All fields are required");
  }

  await sequelize.sync({ alter: true });
  const getOneRecipient = await getRecipient("id", id);

  if (!getOneRecipient) {
    res.status(400);
    throw new Error("Recipient not found");
  }

  res.status(200).json({
    status: "success",
    message: "Recipient found successfully",
    statusCode: 200,
    data: getOneRecipient,
  });
});

//@dec create getRecipientsByUserId
//@route POST /bank/getRecipientsByUserId
//@access public
const getRecipientsByUserId = asyncHandler(async (req, res) => {
  const { user_id } = req.params;

  if (!user_id) {
    res.status(400);
    throw new Error("All fields are required");
  }

  await sequelize.sync({ alter: true });

  const recipients = await Recipient.findAll({
    where: { user_id: user_id },
    include: [{ model: User, as: "User" }],
  });

  if (!recipients || recipients.length === 0) {
    res.status(400);
    throw new Error("Recipients not found");
  }

  // Group recipients by recipient_type
  const groupedRecipients = recipients.reduce((acc, recipient) => {
    const { recipient_type, ...rest } = recipient.toJSON();

    const existingType = acc.find(
      (group) => group.recipient_type === recipient_type
    );
    if (existingType) {
      existingType.recipients.push(rest);
    } else {
      acc.push({ recipient_type, recipients: [rest] });
    }

    return acc;
  }, []);

  res.status(200).json({
    status: "success",
    message: "Recipients found successfully",
    statusCode: 200,
    data: groupedRecipients,
  });
});

//get recipient
const getRecipient = async (field, value) => {
  await sequelize.sync({ alter: true });

  const validFields = ["user_id", "id"];
  if (!validFields.includes(field)) {
    throw new Error("Invalid field provided for recipient lookup");
  }

  const getRecipient = await Recipient.findOne({
    where: { [field]: value },
    include: [{ model: User, as: "User" }],
  });

  if (!getRecipient) {
    throw new Error("Recipient not found");
  }

  return getRecipient;
};

module.exports = {
  createRecipient,
  updateRecipient,
  getRecipientById,
  getRecipientsByUserId,
};
