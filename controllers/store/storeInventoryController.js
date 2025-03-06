const asyncHandler = require("express-async-handler");
const { sequelize } = require("../../config/dbConnection");
const StoreInventory = require("../../models/Production/storeInventory");
const ProductCatalogue = require("../../models/eCommerce/productCatalogue");
const Store = require("../../models/Production/store");

//@dec create store Inventory
//@route POST /store/createstoreinventory
//@access public
const createStoreInventory = asyncHandler(async (req, res) => {
  const {
    store_id,
    product_code,
    quantity_available,
    quantity_reserved,
    reorder_level,
  } = req.body;

  if (!store_id || !product_code || !quantity_available) {
    res.status(400);
    throw new Error("All fields are required");
  }

  await sequelize.sync({ alter: true });
  const storeInventory = await StoreInventory.create({
    store_id,
    product_code,
    quantity_available,
    quantity_reserved,
    reorder_level,
  });

  if (!storeInventory) {
    res.status(400);
    throw new Error("Store Inventory not created");
  }

  const getCreatedStoreInventory = await StoreInventory.findOne({
    where: {
      store_id: store_id,
    },
    include: [
      {
        model: Store,
        as: "Store",
      },
      {
        model: ProductCatalogue,
        as: "ProductCatalogue",
      },
    ],
  });

  res.status(200).json(getCreatedStoreInventory);
});

//@dec create store Inventory transfer
//@route POST /store/createstoreinventoryTransfer
//@access public
const createStoreInventoryTransfer = asyncHandler(async (req, res) => {});

//@dec update store Inventory
//@route POST /store/updateStoreInventory
//@access public
const updateStoreInventory = asyncHandler(async (req, res) => {
  const { quantity_available, quantity_reserved, reorder_level } = req.body;
  const { store_id } = req.params;

  if (!store_id) {
    res.status(400);
    throw new Error("All fields are required");
  }
  const getStoreByPk = await StoreInventory.findOne({
    where: { store_id: store_id },
  });
  if (!getStoreByPk) {
    res.status(400);
    throw new Error("Store not found");
  }

  await sequelize.sync({ alter: true });
  const storeInventory = await StoreInventory.update(
    {
      quantity_available: quantity_available || getStoreByPk.quantity_available,
      quantity_reserved: quantity_reserved || getStoreByPk.quantity_reserved,
      reorder_level: reorder_level || getStoreByPk.reorder_level,
    },
    {
      where: {
        store_id: store_id,
      },
    }
  );

  if (!storeInventory) {
    res.status(400);
    throw new Error("Store Inventory not updated");
  }

  const getStore = await getStoreInventoryByField("store_id", store_id);

  if (!getStore) {
    res.status(400);
    throw new Error("Store Inventory not found");
  }

  res.status(200).json(getStore);
});

const getStoreInventoryByField = async (field, value) => {
  let getUpdatedStoreInventory;
  if (field === "store_id") {
    getUpdatedStoreInventory = await StoreInventory.findOne({
      where: {
        store_id: value,
      },
      include: [
        {
          model: Store,
          as: "Store",
        },
        {
          model: ProductCatalogue,
          as: "ProductCatalogue",
        },
      ],
    });
  } else if (field === "product_code") {
    getUpdatedStoreInventory = await StoreInventory.findOne({
      where: {
        product_code: value,
      },
      include: [
        {
          model: Store,
          as: "Store",
        },
        {
          model: ProductCatalogue,
          as: "ProductCatalogue",
        },
      ],
    });
  }

  if (!getUpdatedStoreInventory) {
    res.status(400);
    throw new Error("Store Inventory not found");
  }

  return getUpdatedStoreInventory;
};

module.exports = { createStoreInventory, updateStoreInventory };
