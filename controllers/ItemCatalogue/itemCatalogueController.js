const asyncHandler = require("express-async-handler");
const ItemCatalogue = require("../../models/eCommerce/ItemCatalogue");
const { sequelize } = require("../../config/dbConnection");
const Category = require("../../models/eCommerce/Category");

//@dec create Item Catalogue
//@route POST /itemCatalogue/create
//@access public
const createItemCatalogue = asyncHandler(async (req, res) => {
  const { category_code, item_name, item_icon } = req.body;

  if (!category_code || !item_name || !item_icon) {
    res.status(400);
    throw new Error("All fields are required");
  }

  const category = await Category.findByPk(category_code);
  if (!category) {
    return res
      .status(400)
      .json({ error: "Invalid category_code. Category does not exist." });
  }

  await sequelize.sync({ alter: true });
  const itemCatalogue = await ItemCatalogue.create({
    category_code,
    item_name,
    item_icon,
  });
  const { item_code } = itemCatalogue;

  // Fetch all items along with category details
  const allItems = await ItemCatalogue.findAll({
    where: { category_code, item_code },
    attributes: [
      "item_code",
      "item_name",
      "item_icon",
      "created_date",
      "updated_date",
    ],
    include: [
      {
        model: Category,
        as: "Category", // Alias for response clarity
        attributes: [
          "category_code",
          "category_type",
          "category",
          "sub_category",
          "category_icon",
          "sub_category_icon",
          "created_date",
          "updated_date",
        ], // Adjust as needed
      },
    ],
    order: [["created_date", "DESC"]], // Latest records first
  });

  // Format response
  const response = allItems.map((item) => ({
    item_code: item.item_code,
    item_name: item.item_name,
    item_icon: item.item_icon,
    created_date: item.created_date,
    updated_date: item.updated_date,
    category_info: item.Category.dataValues, // Includes category details
  }));

  if (response) {
    res.status(201).json({
      status: "success",
      data: response,
    });
  } else {
    res.status(400);
    throw new Error("Item Catalogue not created");
  }
});

//@dec update Item Catalogue
//@route PUT /itemCatalogue/update
//@access public

const updateItemCatalogue = asyncHandler(async (req, res) => {
  const { item_code } = req.params; // Get item_code from URL params
  const { category_code, item_name, item_icon } = req.body;

  // Check if the item exists
  const existingItem = await ItemCatalogue.findByPk(item_code);
  if (!existingItem) {
    return res.status(404).json({ error: "Item not found" });
  }

  // Update the item fields if they are provided in the request
  await existingItem.update({
    category_code: category_code || existingItem.category_code,
    item_name: item_name || existingItem.item_name,
    item_icon: item_icon || existingItem.item_icon,
    updated_date: new Date(),
  });
  const updatedItem = await ItemCatalogue.findAll({
    where: { item_code: item_code },
    attributes: [
      "item_code",
      "item_name",
      "item_icon",
      "created_date",
      "updated_date",
    ],
    include: [
      {
        model: Category,
        as: "Category", // Alias for response clarity
        attributes: [
          "category_code",
          "category_type",
          "category",
          "sub_category",
          "category_icon",
          "sub_category_icon",
          "created_date",
          "updated_date",
        ], // Adjust as needed
      },
    ],
  });

  res
    .status(200)
    .json({ message: "Item updated successfully", data: updatedItem });
});

//@dec get Item Catalogue by Item Code
//@route GET /itemCatalogue/get
//@access public
const getItemByItemCode = asyncHandler(async (req, res) => {
  const { item_code } = req.params; // Get item_code from URL params
  const item = await ItemCatalogue.findAll({
    where: { item_code: item_code },
    attributes: [
      "item_code",
      "item_name",
      "item_icon",
      "created_date",
      "updated_date",
    ],
    include: [
      {
        model: Category,
        as: "Category", // Alias for response clarity
        attributes: [
          "category_code",
          "category_type",
          "category",
          "sub_category",
          "category_icon",
          "sub_category_icon",
          "created_date",
          "updated_date",
        ], // Adjust as needed
      },
    ],
  });
  if (!item) {
    return res.status(404).json({ error: "Item not found" });
  }
  res.status(200).json(item);
});

module.exports = {
  createItemCatalogue,
  updateItemCatalogue,
  getItemByItemCode,
};
