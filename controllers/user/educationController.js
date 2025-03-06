const asyncHandler = require("express-async-handler");
const { sequelize } = require("../../config/dbConnection");
const Education = require("../../models/User/education");
const User = require("../../models/User/user");

// @desc Create Education
// @route POST /education/create
// @access Public
const createEducation = asyncHandler(async (req, res) => {
  const {
    user_id,
    course_name,
    course_duration,
    start_date,
    end_date,
    grade,
    certificate_url,
    institution_name,
    city,
    state,
    postal_code,
    country,
    lat_location,
    lng_location,
  } = req.body;

  if (
    !user_id ||
    !course_name ||
    !course_duration ||
    !start_date ||
    !end_date ||
    !grade ||
    !city ||
    !state ||
    !postal_code ||
    !country
  ) {
    res.status(400);
    throw new Error("All fields are required");
  }

  const getUser = await User.findOne({
    where: {
      user_id: user_id,
    },
  });

  if (!getUser) {
    res.status(404);
    throw new Error("User not found");
  }

  await sequelize.sync({ alter: true });
  const newEducation = await Education.create({
    user_id: user_id,
    course_name: course_name,
    course_duration: course_duration,
    start_date: start_date,
    end_date: end_date,
    grade: grade,
    certificate_url: certificate_url,
    institution_name: institution_name,
    city: city,
    state: state,
    postal_code: postal_code,
    country: country,
    lat_location: lat_location,
    lng_location: lng_location,
  });

  if (!newEducation) {
    res.status(400);
    throw new Error("Education not created");
  }

  res.status(201).json({
    status: "success",
    message: "Education created successfully",
    statusCode: 201,
    data: newEducation,
  });
});

// @desc Update Education
// @route PUT /education/Update/:id
// @access Public
const updateEducation = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    course_name,
    course_duration,
    start_date,
    end_date,
    grade,
    certificate_url,
    institution_name,
    city,
    state,
    postal_code,
    country,
    lat_location,
    lng_location,
  } = req.body;

  if (!id) {
    res.status(400);
    throw new Error("All fields are required");
  }

  await sequelize.sync({ alter: true });
  const getEducation = await Education.findByPk(id);
  if (!getEducation) {
    res.status(400);
    throw new Error("Education not found");
  }
  const updatedEducation = await Education.update(
    {
      course_name: course_name || getEducation.course_name,
      course_duration: course_duration || getEducation.course_duration,
      start_date: start_date || getEducation.start_date,
      end_date: end_date || getEducation.end_date,
      grade: grade || getEducation.grade,
      certificate_url: certificate_url || getEducation.certificate_url,
      institution_name: institution_name || getEducation.institution_name,
      city: city || getEducation.city,
      state: state || getEducation.state,
      postal_code: postal_code || getEducation.postal_code,
      country: country || getEducation.country,
      lat_location: lat_location || getEducation.lat_location,
      lng_location: lng_location || getEducation.lng_location,
    },
    {
      where: {
        id: id,
      },
    }
  );

  if (!updatedEducation) {
    res.status(400);
    throw new Error("Education not updated");
  }
  const getEducationAfterUpdate = await Education.findByPk(id, {
    include: [
      {
        model: User,
        as: "User",
      },
    ],
  });
  if (!getEducationAfterUpdate) {
    res.status(400);
    throw new Error("Education not found");
  }

  res.status(200).json({
    status: "success",
    message: "Education updated successfully",
    statusCode: 200,
    data: getEducationAfterUpdate,
  });
});

// @desc get Education
// @route POST /education/getById/:id
// @access Public
const getEducationById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    res.status(400);
    throw new Error("All fields are required");
  }

  await sequelize.sync({ alter: true });
  const getEducation = await Education.findByPk(id, {
    include: [
      {
        model: User,
        as: "User",
      },
    ],
  });
  if (!getEducation) {
    res.status(400);
    throw new Error("Education not found");
  }

  res.status(200).json({
    status: "success",
    message: "Education found successfully",
    statusCode: 200,
    data: getEducation,
  });
});

// @desc get Education
// @route POST /education/getByUserId/:user_id
// @access Public
const getEducationProfilesByUserId = asyncHandler(async (req, res) => {
  const { user_id } = req.params;
  if (!user_id) {
    res.status(400);
    throw new Error("All fields are required");
  }

  await sequelize.sync({ alter: true });
  const getEducation = await Education.findAll({
    where: {
      user_id: user_id,
    },
  });
  if (!getEducation) {
    res.status(400);
    throw new Error("Education not found");
  }

  res.status(200).json({
    status: "success",
    message: "Education found successfully",
    statusCode: 200,
    data: getEducation,
  });
});

module.exports = {
  createEducation,
  updateEducation,
  getEducationById,
  getEducationProfilesByUserId,
};
