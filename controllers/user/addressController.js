const asyncHandler = require("express-async-handler");
const User = require("../../models/User/user");
const DeliveryAddress = require("../../models/eCommerce/deliveryAddress");
const { sequelize } = require("../../config/dbConnection");

//@dec create delivery address
//@route POST /user/deliveryAddress/create
//@access public
const createAddress = asyncHandler(async (req, res) => {
  const {
    user_id,
    address_type,
    house_no,
    address1,
    address2,
    land_mark,
    city,
    state,
    postal_code,
    country,
    lat_location,
    lng_location,
    address_proof_link,
  } = req.body;
  if (
    !user_id ||
    !address_type ||
    !house_no ||
    !address1 ||
    !land_mark ||
    !city ||
    !state ||
    !postal_code ||
    !country
  ) {
    res.status(400);
    throw new Error("All fields are required");
  }
  await sequelize.sync({ alter: true });
  const getUser = await User.findOne({ where: { user_id } });
  if (!getUser) {
    res.status(404);
    throw new Error("User not found");
  }
  await sequelize.sync({ alter: true });
  const deliveryAddress = await DeliveryAddress.create({
    user_id,
    address_type,
    house_no,
    address1,
    address2,
    land_mark,
    city,
    state,
    postal_code,
    country,
    lat_location,
    lng_location,
    address_proof_link,
  });
  if (!deliveryAddress) {
    res.status(400);
    throw new Error("Address not created");
  }
  const getDeliveryAddress = await DeliveryAddress.findOne({
    where: { id: deliveryAddress.id },
    include: [
      {
        model: User,
        as: "User",
      },
    ],
  });
  res.status(200).json({
    status: "success",
    statusCode: 200,
    message: "Address created successfully",
    data: getDeliveryAddress,
  });
});

//@dec get delivery address by user id
//@route POST /user/deliveryAddress/getbyuser/:user_id
//@access public
const getDeliveryAddress = asyncHandler(async (req, res) => {
  const { user_id } = req.params;

  if (!user_id) {
    res.status(400);
    throw new Error("All fields are required");
  }

  const getUser = await User.findOne({ where: { user_id: user_id } });
  if (!getUser) {
    res.status(404);
    throw new Error("User not found");
  }

  const deliveryAddress = await DeliveryAddress.findAll({
    where: {
      user_id: user_id,
    },
    include: [
      {
        model: User,
        as: "User",
      },
    ],
  });

  // Check if addresses exist for the user
  if (!deliveryAddress || deliveryAddress.length === 0) {
    return res
      .status(404)
      .json({ message: "No delivery addresses found for this user" });
  }

  // Extract user details from the first address entry
  const user = deliveryAddress[0].User
    ? deliveryAddress[0].User.toJSON()
    : null;

  // Remove user details from each address object to avoid redundancy
  const addressList = deliveryAddress.map((address) => {
    const addressData = address.toJSON();
    delete addressData.User; // Remove duplicate user info
    return addressData;
  });

  // Send the response
  return res.status(200).json({ user, address: addressList });
});

//@dec get delivery address by user id
//@route PUT /user/delivery-address/update/:user_id/:id
//@access public
const updateAddress = asyncHandler(async (req, res) => {
  const { user_id, id } = req.params;
  const {
    address_type,
    house_no,
    address1,
    address2,
    land_mark,
    city,
    state,
    postal_code,
    country,
    lat_location,
    lng_location,
    address_proof_link,
    status,
  } = req.body;

  if (!user_id || !id) {
    res.status(400);
    throw new Error("All fields are required");
  }

  const deliveryAddress = await DeliveryAddress.findOne({
    where: {
      user_id: user_id,
      id: id,
    },
  });

  if (!deliveryAddress) {
    res.status(404);
    throw new Error("Delivery address not found");
  }

  const updatedAddress = await deliveryAddress.update(
    {
      address_type: address_type || deliveryAddress.address_type,
      house_no: house_no || deliveryAddress.house_no,
      address1: address1 || deliveryAddress.address1,
      address2: address2 || deliveryAddress.address2,
      land_mark: land_mark || deliveryAddress.land_mark,
      city: city || deliveryAddress.city,
      state: state || deliveryAddress.state,
      postal_code: postal_code || deliveryAddress.postal_code,
      country: country || deliveryAddress.country,
      lat_location: lat_location || deliveryAddress.lat_location,
      lng_location: lng_location || deliveryAddress.lng_location,
      address_proof_link:
        address_proof_link || deliveryAddress.address_proof_link,
      status: status || deliveryAddress.status,
    },
    {
      where: {
        user_id: user_id,
        id: id,
      },
    }
  );

  if (!updatedAddress) {
    res.status(400);
    throw new Error("Address not updated");
  }
  const getUpdatedDeliveryAddress = await DeliveryAddress.findOne({
    where: { id: id },
    include: [
      {
        model: User,
        as: "User",
      },
    ],
  });

  res.status(200).json({
    status: "success",
    statusCode: 200,
    message: "Address updated successfully",
    data: getUpdatedDeliveryAddress,
  });
});

//@dec get delivery address by id
//@route POST /user/deliveryAddress/getbyid/:id
//@access public
const getAddressById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    res.status(400);
    throw new Error("All fields are required");
  }

  const deliveryAddress = await DeliveryAddress.findOne({
    where: {
      id: id,
    },
    include: [
      {
        model: User,
        as: "User",
      },
    ],
  });

  if (!deliveryAddress) {
    res.status(404);
    throw new Error("Delivery address not found");
  }

  res.status(200).json({
    status: "success",
    statusCode: 200,
    message: "Address found successfully",
    data: deliveryAddress,
  });
});

module.exports = {
  getDeliveryAddress,
  createAddress,
  updateAddress,
  getAddressById,
};
