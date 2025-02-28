const asyncHandler = require("express-async-handler");
const { sequelize } = require("../../config/dbConnection");
const CashCenter = require("../../models/Payment/cashCenter");

//@dec create CashCenter
//@route POST /bank/createCashCenter
//@access public
const createCashCenter = asyncHandler(async (req, res) => {
  const {
    cash_center_name,
    area_code,
    country,
    lat_location,
    lng_location,
    mobile_number,
  } = req.body;

  if (
    !cash_center_name ||
    !area_code ||
    !country ||
    !lat_location ||
    !lng_location ||
    !mobile_number
  ) {
    res.status(400);
    throw new Error("All fields are required");
  }

  await sequelize.sync({ alter: true });
  const cashCenter = await CashCenter.create({
    cash_center_name: cash_center_name,
    area_code: area_code,
    country: country,
    lat_location: lat_location,
    lng_location: lng_location,
    mobile_number: mobile_number,
  });

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: "Cash Center created successfully",
    data: cashCenter,
  });
});

//@dec update CashCenter
//@route PUT /bank/updateCashCenter
//@access public
const updateCashCenter = asyncHandler(async (req, res) => {
  const { cash_center_id } = req.params;
  const {
    cash_center_name,
    area_code,
    country,
    lat_location,
    lng_location,
    mobile_number,
  } = req.body;
  if (!cash_center_id) {
    res.status(400);
    throw new Error("All fields are required");
  }
  const getCashCenter = await CashCenter.findByPk(cash_center_id);
  if (!getCashCenter) {
    res.status(400);
    throw new Error("Cash Center not found");
  }
  await sequelize.sync({ alter: true });
  await CashCenter.update(
    {
      cash_center_name: cash_center_name || getCashCenter.cash_center_name,
      area_code: area_code || getCashCenter.area_code,
      country: country || getCashCenter.country,
      lat_location: lat_location || getCashCenter.lat_location,
      lng_location: lng_location || getCashCenter.lng_location,
      mobile_number: mobile_number || getCashCenter.mobile_number,
    },
    {
      where: {
        cash_center_id: cash_center_id,
      },
    }
  );
  const getUpdatedCashCenter = await CashCenter.findOne({
    where: {
      cash_center_id: cash_center_id,
    },
  });

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: "Cash Center updated successfully",
    data: getUpdatedCashCenter,
  });
});

//@dec get CashCenter by area code
//@route POST /bank/getCashCentersByAreaCode/:area_code
//@access public
const getCashCentersByAreaCode = asyncHandler(async (req, res) => {
  const { area_code } = req.params;
  if (!area_code) {
    res.status(400);
    throw new Error("All fields are required");
  }
  const cashCenters = await CashCenter.findAll({
    where: {
      area_code: area_code,
    },
  });
  if (!cashCenters || cashCenters.length === 0) {
    res.status(400);
    throw new Error("Cash Centers not found");
  }
  res.status(200).json({
    success: true,
    statusCode: 200,
    message: "Cash Centers found successfully",
    data: cashCenters,
  });
});

//@dec get all CashCenter
//@route GET /bank/getAllCashCenters
//@access public
const getAllCashCenters = asyncHandler(async (req, res) => {
  const cashCenters = await CashCenter.findAll();
  if (!cashCenters || cashCenters.length === 0) {
    res.status(400);
    throw new Error("Cash Centers not found");
  }
  res.status(200).json({
    success: true,
    statusCode: 200,
    message: "Cash Centers found successfully",
    data: cashCenters,
  });
});

module.exports = {
  createCashCenter,
  updateCashCenter,
  getCashCentersByAreaCode,
  getAllCashCenters,
};
