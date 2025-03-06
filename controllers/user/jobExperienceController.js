const asyncHandler = require("express-async-handler");
const { sequelize } = require("../../config/dbConnection");
const JobExperience = require("../../models/User/jobExperience");
const User = require("../../models/User/user");

// @desc Create job experience
// @route POST /experience/create
// @access Public
const createJobExperience = asyncHandler(async (req, res) => {
  const {
    user_id,
    company_name,
    designation,
    department,
    employment_type,
    start_date,
    end_date,
    working_years,
    job_description,
    salary,
    working_place,
    certificate_url,
    state,
    postal_code,
    country,
    lat_location,
    lng_location,
  } = req.body;

  if (!user_id || !company_name || !state || !postal_code || !country) {
    res.status(400);
    throw new Error("All fields are required");
  }

  const getUser = await User.findOne({
    where: {
      user_id,
    },
  });
  if (!getUser) {
    res.status(400);
    throw new Error("User not found");
  }

  await sequelize.sync({ alter: true });
  const jobExperience = await JobExperience.create({
    user_id,
    company_name,
    designation,
    department,
    employment_type,
    start_date,
    end_date,
    working_years,
    job_description,
    salary,
    working_place,
    certificate_url,
    state,
    postal_code,
    country,
    lat_location,
    lng_location,
  });

  if (!jobExperience) {
    res.status(400);
    throw new Error("Job Experience not created");
  }

  const getJobExperience = await JobExperience.findByPk(jobExperience.id, {
    include: [
      {
        model: User,
        as: "User",
      },
    ],
  });

  res.status(201).json({
    status: "success",
    message: "Job Experience created successfully",
    statusCode: 201,
    data: getJobExperience,
  });
});

// @desc Update job experience
// @route PUT /experience/Update/:id
// @access Public
const updateJobExperience = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    company_name,
    designation,
    department,
    employment_type,
    start_date,
    end_date,
    working_years,
    job_description,
    salary,
    working_place,
    certificate_url,
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
  const getJobExperience = await JobExperience.findByPk(id);
  if (!getJobExperience) {
    res.status(400);
    throw new Error("Job Experience not found");
  }
  const updatedJobExperience = await JobExperience.update(
    {
      company_name: company_name || getJobExperience.company_name,
      designation: designation || getJobExperience.designation,
      department: department || getJobExperience.department,
      employment_type: employment_type || getJobExperience.employment_type,
      start_date: start_date || getJobExperience.start_date,
      end_date: end_date || getJobExperience.end_date,
      working_years: working_years || getJobExperience.working_years,
      job_description: job_description || getJobExperience.job_description,
      salary: salary || getJobExperience.salary,
      working_place: working_place || getJobExperience.working_place,
      certificate_url: certificate_url || getJobExperience.certificate_url,
      state: state || getJobExperience.state,
      postal_code: postal_code || getJobExperience.postal_code,
      country: country || getJobExperience.country,
      lat_location: lat_location || getJobExperience.lat_location,
      lng_location: lng_location || getJobExperience.lng_location,
    },
    {
      where: {
        id: id,
      },
    }
  );

  if (!updatedJobExperience) {
    res.status(400);
    throw new Error("Job Experience not updated");
  }

  const updatedGetJobExperience = await JobExperience.findByPk(id, {
    include: [
      {
        model: User,
        as: "User",
      },
    ],
  });
  if (!updatedGetJobExperience) {
    res.status(400);
    throw new Error("Job Experience not found");
  }

  res.status(200).json({
    status: "success",
    message: "Job Experience updated successfully",
    statusCode: 200,
    data: updatedGetJobExperience,
  });
});

// @desc get job experience by id
// @route POST /experience/byId/:id
// @access Public
const getJobExperienceById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    res.status(400);
    throw new Error("All fields are required");
  }

  await sequelize.sync({ alter: true });
  const getJobExperience = await JobExperience.findByPk(id, {
    include: [
      {
        model: User,
        as: "User",
      },
    ],
  });

  if (!getJobExperience) {
    res.status(400);
    throw new Error("Job Experience not found");
  }

  res.status(200).json({
    status: "success",
    message: "Job Experience found successfully",
    statusCode: 200,
    data: getJobExperience,
  });
});

// @desc get job experience by id
// @route POST /experience/byUserId/:user_id
// @access Public
const getJobExperienceProfilesByUserId = asyncHandler(async (req, res) => {
  const { user_id } = req.params;
  if (!user_id) {
    res.status(400);
    throw new Error("All fields are required");
  }

  await sequelize.sync({ alter: true });
  const getJobExperience = await JobExperience.findAll({
    where: { user_id: user_id },
    include: [
      {
        model: User,
        as: "User",
      },
    ],
  });

  if (!getJobExperience) {
    res.status(400);
    throw new Error("Job Experience not found");
  }

  res.status(200).json({
    status: "success",
    message: "Job Experience found successfully",
    statusCode: 200,
    data: getJobExperience,
  });
});

module.exports = {
  createJobExperience,
  updateJobExperience,
  getJobExperienceById,
  getJobExperienceProfilesByUserId,
};
