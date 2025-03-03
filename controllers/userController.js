const asyncHandler = require("express-async-handler");
const { sequelize } = require("../config/dbConnection");

const User = require("../models/User/user");
const DeliveryAddress = require("../models/eCommerce/deliveryAddress");

//@dec get delivery address by user id
//@route GTE /user/deliveryAddress/:user_id
//@access public
const getDeliveryAddress = asyncHandler(async (req, res) => {
  const { user_id } = req.params;

  if (!user_id) {
    res.status(400);
    throw new Error("All fields are required");
  }

  const deliveryAddress = await DeliveryAddress.findAll({
    where: {
      user_id: user_id,
    },
    attributes: [
      "id",
      "delivery_address_date",
      "address_type",
      "user_id",
      "house_no",
      "area_name",
      "land_mark",
      "city",
      "state",
      "country",
      "postal_code",
    ],
    include: [
      {
        model: User,
        attributes: [
          "user_id",
          "area_code",
          "first_name",
          "profile_image",
          "gender",
          "marital_status",
          "fh_name",
          "date_of_birth",
          "blood_group",
          "country_code",
          "email_id",
          "mobile_number",
          "lat_location",
          "lng_location",
          "created_date",
          "updated_date",
        ],
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

module.exports = { getDeliveryAddress };
