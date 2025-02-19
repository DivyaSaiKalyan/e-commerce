const asyncHandler = require("express-async-handler");
const Category = require("../models/Category");
const { sequelize } = require("../config/dbConnection");

//@dec create Category
//@route POST /category/create
//@access public

const createCategory = asyncHandler(async (req, res) => {
  const {
    category_type,
    category,
    sub_category,
    category_icon,
    sub_category_icon,
  } = req.body;

  if (
    !category_type ||
    !category ||
    !sub_category ||
    !category_icon ||
    !sub_category_icon
  ) {
    res.status(400);
    throw new Error("All fields are required");
  }

  await sequelize.sync({ alter: true });
  const newCategory = await Category.create({
    category_type,
    category,
    sub_category,
    category_icon,
    sub_category_icon,
  });

  if (newCategory) {
    console.log("Category Created Successfully");
    res.status(201).json({
      status: "success",
      data: newCategory,
    });
  } else {
    res.status(400);
    throw new Error("Category not created");
  }
});

//@dec update Category
//@route POST /category/update/:category_code
//@access public
const updateCategory = asyncHandler(async (req, res) => {
  const { category_code } = req.params; // Get category_code from URL params
  const {
    category_type,
    category,
    sub_category,
    category_icon,
    sub_category_icon,
  } = req.body;

  // Check if the category exists
  const existingCategory = await Category.findByPk(category_code);
  if (!existingCategory) {
    return res.status(404).json({ error: "Category not found" });
  }

  // Update the category fields if they are provided in the request
  await existingCategory.update({
    category_type: category_type || existingCategory.category_type,
    category: category || existingCategory.category,
    sub_category: sub_category || existingCategory.sub_category,
    category_icon: category_icon || existingCategory.category_icon,
    sub_category_icon: sub_category_icon || existingCategory.sub_category_icon,
    updated_date: new Date(),
  });

  res
    .status(200)
    .json({ message: "Category updated successfully", data: existingCategory });
});

//@dec get Category by code
//@route GET /category/get/:category_code
//@access public
const getCategoryByCategoryCode = asyncHandler(async (req, res) => {
  const { category_code } = req.params;
  const category = await Category.findByPk(category_code);
  if (!category) {
    return res.status(404).json({ error: "Category not found" });
  }
  res.status(200).json({ data: category });
});

//@dec get  all Categories
//@route GET /category/get
//@access public
const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await Category.findAll({
    attributes: [
      "category_code",
      "category_type",
      "category",
      "category_icon",
      "sub_category",
      "sub_category_icon",
    ],
  });
  // Group data by category_type
  const categoryMap = {};

  categories.forEach((cat) => {
    const categoryType = cat.category_type;
    const categoryCode = cat.category_code;

    if (!categoryMap[categoryType]) {
      categoryMap[categoryType] = {
        category_type: categoryType,
        categories: [],
      };
    }

    // Find if category already exists in the response
    let categoryGroup = categoryMap[categoryType].categories.find(
      (c) => c.category_code === categoryCode
    );

    if (!categoryGroup) {
      categoryGroup = {
        category_code: categoryCode,
        category: cat.category,
        category_icon: cat.category_icon,
        sub_categories: [],
      };
      categoryMap[categoryType].categories.push(categoryGroup);
    }

    // Add subcategory to the list
    categoryGroup.sub_categories.push({
      sub_category: cat.sub_category,
      sub_category_icon: cat.sub_category_icon,
    });
  });

  // Convert the object to an array
  const formattedResponse = Object.values(categoryMap);

  res.status(200).json(formattedResponse);
});

module.exports = {
  createCategory,
  updateCategory,
  getCategoryByCategoryCode,
  getAllCategories,
};
