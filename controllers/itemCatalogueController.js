const asyncHandler = require("express-async-handler");
const ItemCatalogue = require("../models/ItemCatalogue");
const Category = require("../models/Category");
const { sequelize } = require("../config/dbConnection");

//@dec Item Catalogue with Product Catalogue
//@route POST /itemCatalogue/create
//@access public

const createItemCatalogue = asyncHandler(async (req, res) => {
  const { category_code, item_name, item_icon } = req.body;

  if (!category_code || !item_name || !item_icon) {
    res.status(400);
    throw new Error("All fields are required");
  }
  //console.log(req.body);
  const category = await Category.findByPk(category_code);
  if (!category) {
    return res
      .status(400)
      .json({ error: "Invalid category_code. Category does not exist." });
  }

  console.log(category);
  await sequelize.sync({ alter: true });
  const itemCatalogue = await ItemCatalogue.create({
    category_code,
    item_name,
    item_icon,
  });

  if (itemCatalogue) {
    res.status(201).json({
      status: "success",
      data: itemCatalogue,
    });
  } else {
    res.status(400);
    throw new Error("Item Catalogue not created");
  }
});

module.exports = { createItemCatalogue };
