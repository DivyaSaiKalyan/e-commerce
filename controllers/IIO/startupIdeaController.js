const asyncHandler = require("express-async-handler");
const { sequelize } = require("../../config/dbConnection");
const StartupIdea = require("../../models/IIO/startupIdea");
const User = require("../../models/User/user");

// @desc Create a Startup Idea
// @route POST /startupIdea/create
// @access Public
const createStartupIdea = asyncHandler(async (req, res) => {
  const { title_of_an_idea, industry, about_an_idea, location, user_id } =
    req.body;

  if (
    !title_of_an_idea ||
    !industry ||
    !about_an_idea ||
    !location ||
    !user_id
  ) {
    res.status(400);
    throw new Error("All fields are required");
  }

  const getUser = await User.findOne({ where: { user_id } });
  if (!getUser) {
    res.status(404);
    throw new Error("User not found");
  }

  await sequelize.sync({ alter: true });
  const newStartupIdea = await StartupIdea.create({
    title_of_an_idea,
    industry,
    about_an_idea,
    location,
    user_id,
  });

  if (newStartupIdea) {
    res.status(201).json({
      status: "success",
      message: "Startup Idea created successfully",
      statusCode: 201,
      data: newStartupIdea,
    });
  } else {
    res.status(400);
    throw new Error("Startup Idea not created");
  }
});

// @desc Update a Startup Idea
// @route PUT /startupIdea/update/:id
// @access Public
const updateStartupIdea = asyncHandler(async (req, res) => {
  const { id } = req.params; // Get id from URL params
  const { title_of_an_idea, industry, about_an_idea, location, status } =
    req.body;

  // Check if the Startup Idea exists
  const existingIdea = await StartupIdea.findByPk(id);
  if (!existingIdea) {
    return res.status(404).json({ error: "Startup Idea not found" });
  }

  // Update the startup idea fields if they are provided in the request
  await existingIdea.update({
    title_of_an_idea: title_of_an_idea || existingIdea.title_of_an_idea,
    industry: industry || existingIdea.industry,
    about_an_idea: about_an_idea || existingIdea.about_an_idea,
    location: location || existingIdea.location,
    status: status || existingIdea.status,
    updated_date: new Date(),
  });

  res.status(200).json({
    message: "Startup Idea updated successfully",
    statusCode: 200,
    success: true,
    data: existingIdea,
  });
});

// @desc Get Startup Ideas by User ID
// @route GET /startupIdea/user/:user_id
// @access Public
const getStartupIdeasByUserId = asyncHandler(async (req, res) => {
  const { user_id } = req.params;

  const startupIdeas = await StartupIdea.findAll({
    where: { user_id },
    include: [
      {
        model: User,
        as: "User",
      },
    ],
  });

  if (startupIdeas.length === 0) {
    return res
      .status(404)
      .json({ message: "No startup ideas found for this user" });
  }

  // Grouping by status
  const groupedIdeas = startupIdeas.reduce((acc, idea) => {
    const status = idea.status || "New";
    if (!acc[status]) {
      acc[status] = [];
    }
    acc[status].push(idea);
    return acc;
  }, {});

  const formattedResponse = Object.keys(groupedIdeas).map((status) => ({
    status,
    startups: groupedIdeas[status],
  }));

  res.status(200).json({
    status: "success",
    message: "Startup Ideas fetched successfully",
    statusCode: 200,
    data: formattedResponse,
  });
});

// @desc Get All Startup Ideas grouped by Industry
// @route GET /startupIdea/all
// @access Public
const getAll = asyncHandler(async (req, res) => {
  const startupIdeas = await StartupIdea.findAll({
    include: [
      {
        model: User,
        as: "User",
      },
    ],
  });

  if (startupIdeas.length === 0) {
    return res.status(404).json({ message: "No startup ideas found" });
  }

  // Grouping by industry
  const groupedIdeas = startupIdeas.reduce((acc, idea) => {
    const industry = idea.industry || "Unknown";
    if (!acc[industry]) {
      acc[industry] = [];
    }
    acc[industry].push(idea);
    return acc;
  }, {});

  const formattedResponse = Object.keys(groupedIdeas).map((industry) => ({
    industry,
    startups: groupedIdeas[industry],
  }));

  res.status(200).json({
    status: "success",
    message: "Startup Ideas fetched successfully",
    statusCode: 200,
    data: formattedResponse,
  });
});

module.exports = {
  createStartupIdea,
  updateStartupIdea,
  getStartupIdeasByUserId,
  getAll,
};
