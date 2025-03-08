const asyncHandler = require("express-async-handler");
const { sequelize } = require("../../config/dbConnection");
const GapProfile = require("../../models/User/gapProfile");
const User = require("../../models/User/user");

//@dec create gap profile
//@route POST /user/gapProfile/create
//@access public
const createGapProfile = asyncHandler(async (req, res) => {
  const { user_id, profile_type, profile_name, profile_status } = req.body;

  if (!user_id || !profile_type || !profile_name || !profile_status) {
    res.status(400);
    throw new Error("Required fields are missing");
  }

  // Check if user exists
  const user = await User.findOne({ where: { user_id } });
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  await sequelize.sync({ alter: true });
  const newGapProfile = await GapProfile.create({
    user_id,
    profile_type,
    profile_name,
    profile_status,
  });
  const getGapProfile = await GapProfile.findOne({
    where: {
      id: newGapProfile.id,
    },
    include: [
      {
        model: User,
        as: "User",
      },
    ],
  });
  res.status(201).json({
    status: "success",
    message: "Gap Profile created successfully",
    statusCode: 201,
    data: getGapProfile,
  });
});

//@dec update gap profile
//@route POST /user/gapProfile/update
//@access public
const updateGapProfile = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { profile_type, profile_name, profile_status } = req.body;

  const gapProfile = await GapProfile.findByPk(id);
  if (!gapProfile) {
    res.status(404);
    throw new Error("Gap Profile not found");
  }

  gapProfile.profile_type = profile_type || gapProfile.profile_type;
  gapProfile.profile_name = profile_name || gapProfile.profile_name;
  gapProfile.profile_status = profile_status || gapProfile.profile_status;

  await gapProfile.save();

  const getGapProfile = await GapProfile.findOne({
    where: {
      id: gapProfile.id,
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
    message: "Gap Profile updated successfully",
    statusCode: 200,
    data: getGapProfile,
  });
});

//@dec get gap profile by id
//@route POST /user/gapProfilebyid/:id
//@access public
const getGapProfileById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    res.status(400);
    throw new Error("All fields are required");
  }

  await sequelize.sync({ alter: true });
  const getGapProfile = await GapProfile.findByPk(id, {
    include: [
      {
        model: User,
        as: "User",
      },
    ],
  });

  if (!getGapProfile) {
    res.status(400);
    throw new Error("Gap Profile not found");
  }

  res.status(200).json({
    status: "success",
    message: "Gap Profile found successfully",
    statusCode: 200,
    data: getGapProfile,
  });
});

//@dec get gap profile by user id
//@route POST /user/gapProfilebyuserid/:user_id
//@access public
const getGapProfileByUserId = asyncHandler(async (req, res) => {
  const { user_id } = req.params;
  if (!user_id) {
    res.status(400);
    throw new Error("All fields are required");
  }

  await sequelize.sync({ alter: true });
  const getGapProfile = await GapProfile.findAll({
    where: { user_id: user_id },
    include: [
      {
        model: User,
        as: "User",
      },
    ],
  });

  if (!getGapProfile) {
    res.status(400);
    throw new Error("Gap Profile not found");
  }

  res.status(200).json({
    status: "success",
    message: "Gap Profile found successfully",
    statusCode: 200,
    data: getGapProfile,
  });
});

module.exports = {
  createGapProfile,
  updateGapProfile,
  getGapProfileById,
  getGapProfileByUserId,
};
