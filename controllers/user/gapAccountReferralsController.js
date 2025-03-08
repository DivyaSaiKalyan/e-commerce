const asyncHandler = require("express-async-handler");
const { sequelize } = require("../../config/dbConnection");
const GapAccountReferrals = require("../../models/User/gapAccountReferrals");
const User = require("../../models/User/user");

//@dec create GapAccountReferral
//@route POST /user/GapAccountReferral/create
//@access public
const createGapAccountReferral = asyncHandler(async (req, res) => {
  const { user_id, ref_user_id, ref_profile_type, ref_profile_name } = req.body;

  if (!user_id || !ref_user_id || !ref_profile_type || !ref_profile_name) {
    res.status(400);
    throw new Error("All fields are required");
  }

  // Check if user exists
  const user = await User.findOne({ where: { user_id } });
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Check if ref_user_id exists
  const refUser = await User.findOne({ where: { user_id: ref_user_id } });
  if (!refUser) {
    res.status(404);
    throw new Error("Ref User not found");
  }

  await sequelize.sync({ alter: true });
  const newGapAccountReferral = await GapAccountReferrals.create({
    user_id,
    ref_user_id,
    ref_profile_type,
    ref_profile_name,
  });

  const getGapAccountReferral = await GapAccountReferrals.findOne({
    where: {
      id: newGapAccountReferral.id,
    },
    include: [
      {
        model: User,
        as: "User",
      },
      {
        model: User,
        as: "ReferredUser",
      },
    ],
  });

  res.status(200).json({
    status: "success",
    message: "Gap Account Referral created successfully",
    statusCode: 200,
    data: getGapAccountReferral,
  });
});

//@dec upadte GapAccountReferral
//@route PUT /user/GapAccountReferral/update/:id
//@access public
const updateGapAccountReferral = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { ref_user_id, ref_profile_type, ref_profile_name } = req.body;

  const gapAccountReferral = await GapAccountReferrals.findByPk(id);
  if (!gapAccountReferral) {
    res.status(404);
    throw new Error("Gap Account Referral not found");
  }

  gapAccountReferral.ref_user_id =
    ref_user_id || gapAccountReferral.ref_user_id;
  gapAccountReferral.ref_profile_type =
    ref_profile_type || gapAccountReferral.ref_profile_type;
  gapAccountReferral.ref_profile_name =
    ref_profile_name || gapAccountReferral.ref_profile_name;

  await gapAccountReferral.save();

  const getGapAccountReferral = await GapAccountReferrals.findOne({
    where: {
      id: gapAccountReferral.id,
    },
    include: [
      {
        model: User,
        as: "User",
      },
      {
        model: User,
        as: "ReferredUser",
      },
    ],
  });

  res.status(200).json({
    status: "success",
    message: "Gap Account Referral updated successfully",
    statusCode: 200,
    data: getGapAccountReferral,
  });
});

//@dec get GapAccountReferral by id
//@route POST /user/getGapAccountReferralbyid/:id
//@access public
const getGapAccountReferralById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    res.status(400);
    throw new Error("All fields are required");
  }

  await sequelize.sync({ alter: true });
  const getGapAccountReferral = await GapAccountReferrals.findByPk(id, {
    include: [
      {
        model: User,
        as: "User",
      },
      {
        model: User,
        as: "ReferredUser",
      },
    ],
  });

  if (!getGapAccountReferral) {
    res.status(400);
    throw new Error("Gap Account Referral not found");
  }

  res.status(200).json({
    status: "success",
    message: "Gap Account Referral found successfully",
    statusCode: 200,
    data: getGapAccountReferral,
  });
});

//@dec get GapAccountReferral by user id
//@route POST /user/getGapAccountReferralsByUserId/:id
//@access public
const getGapAccountReferralsByUserId = asyncHandler(async (req, res) => {
  const { user_id } = req.params;
  if (!user_id) {
    res.status(400);
    throw new Error("All fields are required");
  }

  await sequelize.sync({ alter: true });
  const getGapAccountReferrals = await GapAccountReferrals.findAll({
    where: {
      user_id,
    },
    include: [
      {
        model: User,
        as: "User",
      },
      {
        model: User,
        as: "ReferredUser",
      },
    ],
  });

  if (!getGapAccountReferrals) {
    res.status(400);
    throw new Error("Gap Account Referrals not found");
  }

  res.status(200).json({
    status: "success",
    message: "Gap Account Referrals found successfully",
    statusCode: 200,
    data: getGapAccountReferrals,
  });
});

module.exports = {
  createGapAccountReferral,
  updateGapAccountReferral,
  getGapAccountReferralById,
  getGapAccountReferralsByUserId,
};
