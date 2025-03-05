const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../../models/User/user");
const Role = require("../../models/User/role");
const { sequelize } = require("../../config/dbConnection");
const { Op } = require("sequelize");

//@dec create User
//@route POST /user/create
//@access public
const createUser = asyncHandler(async (req, res) => {
  const {
    user_id,
    password,
    role, // Role Name (e.g., "Admin", "User")
    area_code,
    first_name,
    last_name,
    profile_image,
    gender,
    marital_status,
    fh_name,
    date_of_birth,
    blood_group,
    country_code,
    mobile_number,
    email_id,
    lat_location,
    lng_location,
    user_status,
  } = req.body;

  if (
    !user_id ||
    !password ||
    !role ||
    !area_code ||
    !first_name ||
    !last_name ||
    !mobile_number ||
    !email_id
  ) {
    res.status(400);
    throw new Error("Required fields are missing");
  }

  //Check if user already exists
  await sequelize.sync({ alter: true });
  const existingUser = await User.findOne({ where: { email_id: email_id } });
  if (existingUser) {
    res.status(400);
    throw new Error("User already exists with this email");
  }
  // Find or Create Role
  await sequelize.sync({ alter: true });
  let existingRole = await Role.findOne({ where: { role } });
  if (!existingRole) {
    existingRole = await Role.create({ role });
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  //Create user with role_id
  await sequelize.sync({ alter: true });
  const newUser = await User.create({
    user_id,
    password_hash: hashedPassword,
    role_id: existingRole.id, // Assign the role
    area_code,
    first_name,
    last_name,
    profile_image,
    gender,
    marital_status,
    fh_name,
    date_of_birth,
    blood_group,
    country_code,
    mobile_number,
    email_id,
    lat_location,
    lng_location,
    user_status,
  });

  res.status(201).json({
    status: "success",
    message: "User created successfully",
    data: newUser,
  });
});

//@dec create User
//@route POST /user/login
//@access public
const loginUser = asyncHandler(async (req, res) => {
  const { email_id, password } = req.body;

  // Check if user exists
  const user = await User.findOne({ where: { email_id } });

  if (!user) {
    res.status(401);
    throw new Error("Invalid credentials");
  }

  // Compare entered password with hashed password
  const isMatch = await bcrypt.compare(password, user.password_hash);

  if (!isMatch) {
    res.status(401);
    throw new Error("Invalid credentials");
  }

  // Generate JWT token
  const token = jwt.sign({ user_id: user.user_id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  res.json({
    status: "success",
    statusCode: 200,
    message: "Login successful",
    token,
    user: {
      user_id: user.user_id,
      first_name: user.first_name,
      last_name: user.last_name,
      email_id: user.email_id,
      user_status: user.user_status,
    },
  });
});

// example
// email_id: "johndoe1@example.com"
// password: "mypassword123"

//@dec Update User
//@route PUT /user/Update/:user_id
//@access public
const updateUser = asyncHandler(async (req, res) => {
  const { user_id } = req.params;
  const {
    role,
    area_code,
    first_name,
    last_name,
    profile_image,
    gender,
    marital_status,
    fh_name,
    date_of_birth,
    blood_group,
    country_code,
    mobile_number,
    email_id,
    lat_location,
    lng_location,
    user_status,
  } = req.body;
  let getRole;

  // Check if user exists
  const user = await User.findOne({ where: { user_id } });

  if (!user) {
    res.status(401);
    throw new Error("user not found");
  }
  if (role) {
    getRole = await Role.findOne({ where: { role: role } });
  } else {
    getRole = await Role.findOne({ where: { id: user.role_id } });
  }

  if (!getRole) {
    res.status(400);
    throw new Error("Role not found");
  }

  await sequelize.sync({ alter: true });
  const updatedUser = await User.update(
    {
      role_id: getRole.dataValues.id,
      area_code: area_code || user.dataValues.area_code,
      first_name: first_name || user.dataValues.first_name,
      last_name: last_name || user.dataValues.last_name,
      profile_image: profile_image || user.dataValues.profile_image,
      gender: gender || user.gender,
      marital_status: marital_status || user.dataValues.marital_status,
      fh_name: fh_name || user.fh_name,
      date_of_birth: date_of_birth || user.dataValues.date_of_birth,
      blood_group: blood_group || user.dataValues.blood_group,
      country_code: country_code || user.dataValues.country_code,
      mobile_number: mobile_number || user.dataValues.mobile_number,
      email_id: email_id || user.dataValues.email_id,
      lat_location: lat_location || user.dataValues.lat_location,
      lng_location: lng_location || user.dataValues.lng_location,
      user_status: user_status || user.dataValues.user_status,
    },
    {
      where: {
        user_id: user_id,
      },
    }
  );
  if (!updatedUser) {
    res.status(400);
    throw new Error("User not updated");
  }
  const updatedUserDetails = await User.findOne({
    where: {
      user_id: user_id,
    },
    include: [
      {
        model: Role,
        as: "Role",
      },
    ],
  });

  res.json({
    message: "User updated successfully",
    statusCode: 200,
    success: true,
    data: updatedUserDetails,
  });
});

//@dec Update User password
//@route PUT /user/passwordupdate/:user_id
//@access public
const updatePassword = asyncHandler(async (req, res) => {
  const { user_id } = req.params;
  const { current_password, new_password } = req.body;
  // Check if user exists
  const user = await User.findOne({ where: { user_id } });
  if (!user) {
    res.status(401);
    throw new Error("Invalid credentials");
  }
  // Compare entered password with hashed password
  const isMatch = await bcrypt.compare(current_password, user.password_hash);
  if (!isMatch) {
    res.status(401);
    throw new Error("Invalid credentials");
  }
  const salt = await bcrypt.genSalt(10);
  const newPassword = await bcrypt.hash(new_password, salt);
  await sequelize.sync({ alter: true });
  const updatedUser = await user.update(
    {
      password: newPassword,
    },
    {
      where: {
        user_id: user_id,
      },
    }
  );
  if (!updatedUser) {
    res.status(400);
    throw new Error("User not updated");
  } else {
    const updatedUserDetails = await User.findOne({
      where: {
        user_id: user_id,
      },
      include: [
        {
          model: Role,
          as: "Role",
        },
      ],
    });
    res.json({
      message: "Password updated successfully",
      statusCode: 200,
      success: true,
      data: updatedUserDetails,
    });
  }
});

//@dec get User by user_id
//@route POST /user/getUser/:user_id
//@access public
const getUserByUserId = asyncHandler(async (req, res) => {
  const { user_id } = req.params;

  const user = await User.findOne({
    where: { user_id },
    include: [{ model: Role, as: "Role" }],
  });

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.status(201).json({
    status: "success",
    message: "User found successfully",
    statusCode: 200,
    data: user,
  });
});

//@dec Get all users with optional date filters
//@route POST /user/getUsers/:from_date/:to_date
//@access public
const getAllUsers = asyncHandler(async (req, res) => {
  const { from_date, to_date } = req.query;

  let whereClause = {};
  if (from_date && to_date) {
    whereClause.created_date = {
      [Op.between]: [new Date(from_date), new Date(to_date)],
    };
  }

  const users = await User.findAll({
    where: whereClause,
    include: [{ model: Role, as: "Role" }],
  });

  res.status(200).json({
    status: "success",
    message: "Users found successfully",
    statusCode: 200,
    data: users,
  });
});

module.exports = {
  createUser,
  loginUser,
  updateUser,
  getUserByUserId,
  getAllUsers,
  updatePassword,
};
