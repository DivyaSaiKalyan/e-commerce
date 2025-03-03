const asyncHandler = require("express-async-handler");
const { sequelize } = require("../config/dbConnection");
const User = require("../models/User/user");
const Store = require("../models/Production/store");

//@dec create store
//@route POST /store/createstore
//@access public
const createStore = asyncHandler(async (req, res) => {
  const {
    user_id,
    store_name,
    store_type,
    area_code,
    store_address,
    contact_number,
    email_id,
    lat_location,
    lng_location,
    about_store,
  } = req.body;

  if (
    !user_id ||
    !store_name ||
    !store_type ||
    !area_code ||
    !store_address ||
    !lat_location ||
    !lng_location ||
    !about_store
  ) {
    res.status(400);
    throw new Error("All fields are required");
  }

  await sequelize.sync({ alter: true });
  const createStore = await Store.create({
    user_id,
    store_name,
    store_type,
    area_code,
    store_address,
    contact_number,
    email_id,
    lat_location,
    lng_location,
    about_store,
  });
  if (!createStore) {
    res.status(400);
    throw new Error("Store not created");
  }
  const getStore = await getStoreByField("store_id", createStore.store_id);

  if (getStore) {
    res.status(201).json({
      message: "Store created successfully",
      data: getStore,
    });
  }
});

//@dec get store by user id
//@route GET /store/getstorebyuserid/:user_id
//@access public
const getStoreByUserId = asyncHandler(async (req, res) => {
  const { user_id } = req.params;
  const getStore = await getStoreByField("user_id", user_id);
  if (!getStore) {
    res.status(400);
    throw new Error("Store not found");
  }
  res.status(200).json(getStore);
});

//@dec get store by store id
//@route GET /store/getstorebystoreid/:store_id
//@access public
const getStoreByStoreId = asyncHandler(async (req, res) => {
  const { store_id } = req.params;
  const getStore = await getStoreByField("store_id", store_id);
  if (!getStore) {
    res.status(400);
    throw new Error("Store not found");
  }
  res.status(200).json(getStore);
});

//@dec get store by area code
//@route GET /store/getstorebyareacode/:area_code
//@access public
const getStoresByAreaCode = asyncHandler(async (req, res) => {
  const { area_code } = req.params;
  const getStore = await getStoreByField("area_code", area_code);
  if (!getStore) {
    res.status(400);
    throw new Error("Store not found");
  }
  res.status(200).json(getStore);
});

//@dec get store by store type
//@route GET /store/getstorebystoretype/:store_type
//@access public
const getStoresByStoreType = asyncHandler(async (req, res) => {
  const { store_type } = req.params;
  const getStore = await getStoreByField("store_type", store_type);
  if (!getStore) {
    res.status(400);
    throw new Error("Store not found");
  }
  res.status(200).json(getStore);
});

//common method for get store
const getStoreByField = async (field, value) => {
  let getStore;
  if (field === "store_id") {
    getStore = await Store.findOne({
      where: {
        store_id: value,
      },
      include: [
        {
          model: User,
          as: "User",
        },
      ],
    });
  } else if (field === "user_id") {
    getStore = await Store.findOne({
      where: {
        user_id: value,
      },
      include: [
        {
          model: User,
          as: "User",
        },
      ],
    });
  } else if (field === "area_code") {
    getStore = await Store.findAll({
      where: {
        area_code: value,
      },
      include: [
        {
          model: User,
          as: "User",
        },
      ],
    });
  } else if (field === "store_type") {
    getStore = await Store.findAll({
      where: {
        store_type: value,
      },
      include: [
        {
          model: User,
          as: "User",
        },
      ],
    });
  }

  if (!getStore) {
    throw new Error("Store not found");
  }

  return getStore;
};

module.exports = {
  createStore,
  getStoreByUserId,
  getStoreByStoreId,
  getStoresByAreaCode,
  getStoresByStoreType,
};
