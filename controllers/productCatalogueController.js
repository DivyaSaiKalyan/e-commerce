const asyncHandler = require("express-async-handler");
const { sequelize } = require("../config/dbConnection");
const ProductCatalogue = require("../models/productCatalogue");

//@dec Product Catalogue
//@route POST /productCatalogue/create
//@access public
const createProductCatalogue = asyncHandler(async (req, res) => {
  const {
    country_code,
    item_code,
    product_name,
    product_desc,
    product_size,
    product_color,
    product_price,
    market_price,
    photo_links,
    ref_link,
    product_dimensions,
    item_weight,
    manufacturer,
  } = req.body;

  if (
    !country_code ||
    !item_code ||
    !product_name ||
    !product_desc ||
    !product_size ||
    !product_color ||
    !product_price ||
    !market_price ||
    !photo_links ||
    !ref_link ||
    !product_dimensions ||
    !item_weight ||
    !manufacturer
  ) {
    res.status(400);
    throw new Error("All fields are required");
  }

  await sequelize.sync({ alter: true });
  const productCatalogue = await ProductCatalogue.create({
    country_code,
    item_code,
    product_name,
    product_desc,
    product_size,
    product_color,
    product_price,
    market_price,
    photo_links,
    ref_link,
    product_dimensions,
    item_weight,
    manufacturer,
  });

  if (productCatalogue) {
    res.status(201).json({
      message: "Product Catalogue created successfully",
      data: productCatalogue,
    });
  } else {
    res.status(400);
    throw new Error("Product Catalogue not created");
  }
});

module.exports = { createProductCatalogue };
