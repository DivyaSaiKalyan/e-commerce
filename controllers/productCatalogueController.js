const asyncHandler = require("express-async-handler");
const { sequelize } = require("../config/dbConnection");
const ProductInfo = require("../models/eCommerce/productInfo");
const Category = require("../models/eCommerce/Category");
const ItemCatalogue = require("../models/eCommerce/ItemCatalogue");
const ProductCatalogue = require("../models/eCommerce/productCatalogue");

//@dec Create Product Catalogue
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
    product_info,
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
    !product_info ||
    !manufacturer
  ) {
    res.status(400);
    throw new Error("All fields are required");
  }
  const itemCatalogue = await ItemCatalogue.findByPk(item_code);
  if (!itemCatalogue) {
    res.status(400);
    throw new Error("Item Catalogue not found");
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
  if (!productCatalogue) {
    res.status(400);
    throw new Error("Product Catalogue not created");
  }
  await sequelize.sync({ alter: true });
  const productInfo = await ProductInfo.create({
    product_code: productCatalogue.product_code,
    product_info,
  });
  if (!productInfo) {
    res.status(400);
    throw new Error("Product Info not created");
  }
  const getCreatedProduct = await ProductInfo.findAll({
    where: { product_code: productCatalogue.product_code },
    attributes: [
      "product_code",
      "product_info",
      "created_date",
      "updated_date",
    ],
    include: [
      {
        model: ProductCatalogue,
        attributes: [
          "product_code",
          "country_code",
          "item_code",
          "product_name",
          "product_desc",
          "product_size",
          "product_color",
          "product_price",
          "market_price",
          "photo_links",
          "ref_link",
          "product_dimensions",
          "item_weight",
          "manufacturer",
          "created_date",
        ], // Adjust as needed
        include: [
          {
            model: ItemCatalogue,
            attributes: [
              "item_name",
              "item_code",
              "item_icon",
              "created_date",
              "updated_date",
            ],
            include: [
              {
                model: Category,
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
          },
        ],
      },
    ],
  });

  if (getCreatedProduct) {
    res.status(201).json({
      message: "Product Catalogue created successfully",
      data: getCreatedProduct,
    });
  } else {
    res.status(400);
    throw new Error("Product Catalogue not created");
  }
});

//@dec Create Product and item Catalogue
//@route POST /productCatalogue/itemCatalogue/create
//@access public
const createProductAndItemCatalogue = asyncHandler(async (req, res) => {
  const {
    category_code,
    item_name,
    item_icon,
    country_code,
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
    product_info,
  } = req.body;

  if (
    !category_code ||
    !item_name ||
    !item_icon ||
    !country_code ||
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
    !manufacturer ||
    !product_info
  ) {
    res.status(400);
    throw new Error("All fields are required");
  }
  let itemCatalogue;
  itemCatalogue = await ItemCatalogue.findOne({
    where: {
      category_code,
      item_name: sequelize.where(
        sequelize.fn("LOWER", sequelize.col("item_name")),
        "=",
        item_name.toLowerCase()
      ),
    },
  });
  if (!itemCatalogue) {
    await sequelize.sync({ alter: true });
    itemCatalogue = await ItemCatalogue.create({
      category_code,
      item_name,
      item_icon,
    });
  }
  await sequelize.sync({ alter: true });
  const productCatalogue = await ProductCatalogue.create({
    country_code,
    item_code: itemCatalogue.item_code,
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
  await sequelize.sync({ alter: true });
  await ProductInfo.create({
    product_code: productCatalogue.product_code,
    product_info,
  });

  if (productCatalogue && itemCatalogue) {
    const resultData = await ItemCatalogue.findAll({
      where: { item_code: itemCatalogue.item_code },
      include: [
        {
          model: ProductCatalogue,
          as: "ProductCatalogues",
          include: [
            {
              model: ProductInfo,
              as: "ProductInfos",
            },
          ],
        },
      ],
    });
    res.status(201).json({
      statusResult: "success",
      statusCode: 201,
      message: "Product Catalogue created successfully",
      data: resultData,
    });
  }
});

//@dec Update Product Catalogue
//@route PUT /productCatalogue/create
//@access public
const updateProductCatalogue = asyncHandler(async (req, res) => {
  const { product_code } = req.params; // Get product_code from URL params
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
    product_info,
  } = req.body;

  // Check if the product exists
  const existingProduct = await ProductCatalogue.findByPk(product_code);
  if (!existingProduct) {
    return res.status(404).json({ error: "Product not found" });
  }

  // Update the product fields if they are provided in the request
  await existingProduct.update({
    country_code: country_code || existingProduct.country_code,
    item_code: item_code || existingProduct.item_code,
    product_name: product_name || existingProduct.product_name,
    product_desc: product_desc || existingProduct.product_desc,
    product_size: product_size || existingProduct.product_size,
    product_color: product_color || existingProduct.product_color,
    product_price: product_price || existingProduct.product_price,
    market_price: market_price || existingProduct.market_price,
    photo_links: photo_links || existingProduct.photo_links,
    ref_link: ref_link || existingProduct.ref_link,
    product_dimensions:
      product_dimensions || existingProduct.product_dimensions,
    item_weight: item_weight || existingProduct.item_weight,
    manufacturer: manufacturer || existingProduct.manufacturer,
    updated_date: new Date(),
  });

  // Update the product info if provided in the request
  let updatedCreatedProductInfo;

  if (product_info) {
    const productInfo = await ProductInfo.findOne({
      where: { product_code: product_code },
    });
    if (productInfo) {
      updatedCreatedProductInfo = await productInfo.update({
        product_info: product_info,
        updated_date: new Date(),
      });
    } else {
      updatedCreatedProductInfo = await ProductInfo.create({
        product_code: product_code,
        product_info: product_info,
      });
    }
  }

  res.status(200).json({
    message: "Product updated successfully",
    data: existingProduct,
    productInfo: updatedCreatedProductInfo,
  });
});

//@dec get Product Catalogue by Product Code
//@route GET /productCatalogue/get
//@access public
const getProductByProductCode = asyncHandler(async (req, res) => {
  const { product_code } = req.params; // Get product_code from URL params
  const product = await ProductCatalogue.findByPk(product_code);
  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }

  const productByCode = await ProductInfo.findAll({
    where: { product_code: product_code },
    attributes: [
      "product_code",
      "product_info",
      "created_date",
      "updated_date",
    ],
    include: [
      {
        model: ProductCatalogue,
        attributes: [
          "product_code",
          "country_code",
          "item_code",
          "product_name",
          "product_desc",
          "product_size",
          "product_color",
          "product_price",
          "market_price",
          "photo_links",
          "ref_link",
          "product_dimensions",
          "item_weight",
          "manufacturer",
          "created_date",
          "updated_date",
        ],
        include: [
          {
            model: ItemCatalogue,
            attributes: [
              "item_name",
              "item_code",
              "item_icon",
              "created_date",
              "updated_date",
            ],
            include: [
              {
                model: Category,
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
          },
        ],
      },
    ],
  });

  if (!productByCode) {
    return res.status(404).json({ error: "Product not found" });
  }
  res.status(200).json({ message: "Product found", data: productByCode });
});

//@dec get Products by Category
//@route GET /productCatalogue/get
//@access public
const getProductsByCategory = asyncHandler(async (req, res) => {
  const { category_code } = req.params;
  const category = await Category.findByPk(category_code);
  if (!category) {
    return res.status(404).json({ error: "Category not found" });
  }
  const products = await Category.findOne({
    where: { category_code: category_code },
    attributes: ["category_code", "category_type", "category", "sub_category"],
    include: [
      {
        model: ItemCatalogue,
        attributes: [
          "item_name",
          "item_code",
          "item_icon",
          "created_date",
          "updated_date",
        ],
        include: [
          {
            model: ProductCatalogue,
            attributes: [
              "product_code",
              "country_code",
              "product_name",
              "product_desc",
              "product_size",
              "product_color",
              "product_price",
              "market_price",
              "photo_links",
              "ref_link",
              "product_dimensions",
              "item_weight",
              "manufacturer",
              "created_date",
              "updated_date",
            ],
            include: [
              {
                model: ProductInfo,
                as: "ProductInfos",
                attributes: ["id", "product_info", "created_date"],
              },
            ],
          },
        ],
      },
    ],
  });
  if (products.length === 0) {
    return res.status(404).json({ error: "Products not found" });
  }

  return res.status(200).json(products);
});

module.exports = {
  createProductCatalogue,
  updateProductCatalogue,
  getProductByProductCode,
  getProductsByCategory,
  createProductAndItemCatalogue,
};
