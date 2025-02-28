const asyncHandler = require("express-async-handler");
const { sequelize } = require("../config/dbConnection");
const {
  generateUniqueBatchNumberForProduction,
} = require("../services/helperService");
const Production = require("../models/Production/production");
const User = require("../models/user");
const ProductCatalogue = require("../models/eCommerce/productCatalogue");
const ProductionMaterial = require("../models/Production/productionMaterial");
const ProductionQualityCheck = require("../models/Production/productionQualityCheck");

//@dec create production
//@route POST /production/create
//@access public
const createProduction = asyncHandler(async (req, res) => {
  const {
    expected_completion_date,
    actual_completion_date,
    product_code,
    quantity_produced,
    labor_cost,
    team_user_id,
    remarks,
  } = req.body;

  if (!product_code || !quantity_produced || !labor_cost || !team_user_id) {
    res.status(400);
    throw new Error("All fields are required");
  }

  const uniqueBatchNumber = generateUniqueBatchNumberForProduction();

  await sequelize.sync({ alter: true });
  const production = await Production.create({
    production_date: new Date(),
    expected_completion_date,
    actual_completion_date,
    batch_number: uniqueBatchNumber,
    product_code,
    quantity_produced,
    labor_cost,
    team_user_id,
    remarks,
  });

  // Fetch associated data using `findOne`
  const fullProduction = await Production.findOne({
    where: { id: production.id },
    include: [
      {
        model: User,
        as: "User",
      },
      {
        model: ProductCatalogue,
        as: "ProductCatalogue",
      },
    ],
  });

  res.status(200).json(fullProduction);
});

//@dec update production
//@route PUT /production/update
//@access public
const updateProduction = asyncHandler(async (req, res) => {
  const {
    production_date,
    batch_number,
    expected_completion_date,
    actual_completion_date,
    quantity_produced,
    labor_cost,
    quality_check_status,
    remarks,
    production_status,
  } = req.body;

  const { id } = req.params;

  if (!id) {
    res.status(400);
    throw new Error("All fields are required");
  }
  const getProduction = await Production.findByPk(id);
  if (!getProduction) {
    res.status(400);
    throw new Error("Production not found");
  }

  await sequelize.sync({ alter: true });
  await Production.update(
    {
      production_date: production_date || getProduction.production_date,
      batch_number: batch_number || getProduction.batch_number,
      expected_completion_date:
        expected_completion_date || getProduction.expected_completion_date,
      actual_completion_date:
        actual_completion_date || getProduction.actual_completion_date,
      quantity_produced: quantity_produced || getProduction.quantity_produced,
      labor_cost: labor_cost || getProduction.labor_cost,
      quality_check_status:
        quality_check_status || getProduction.quality_check_status,
      remarks: remarks || getProduction.remarks,
      production_status: production_status || getProduction.production_status,
    },
    {
      where: {
        id: getProduction.id,
      },
    }
  );

  // Fetch associated data using `findOne`
  const upadtedProduction = await Production.findOne({
    where: { id: getProduction.id },
    include: [
      {
        model: User,
        as: "User",
      },
      {
        model: ProductCatalogue,
        as: "ProductCatalogue",
      },
    ],
  });

  res.status(200).json(upadtedProduction);
});

//@dec create production material
//@route POST /production/materialcreate
//@access public
const createProductionMaterial = asyncHandler(async (req, res) => {
  const { production_no, material_name, quantity } = req.body;

  if (!production_no || !material_name || !quantity) {
    res.status(400);
    throw new Error("All fields are required");
  }

  await sequelize.sync({ alter: true });
  const createProductionMaterial = await ProductionMaterial.create({
    transaction_date: new Date(),
    production_no,
    material_name,
    quantity,
  });

  // Fetch associated data using `findOne`
  const upadtedProduction = await ProductionMaterial.findOne({
    where: { id: createProductionMaterial.id },
    include: [
      {
        model: Production,
        as: "Production",
      },
    ],
  });

  res.status(200).json(upadtedProduction);
});

//@dec create Quality Inspection
//@route POST /production/qualityinspection/create
//@access public
const createQualityInspection = asyncHandler(async (req, res) => {
  const {
    production_id,
    checked_by_user_id,
    defects_found,
    corrective_action,
    remarks,
  } = req.body;

  if (!production_id || !checked_by_user_id) {
    res.status(400);
    throw new Error("All fields are required");
  }

  const uniqueBatchNumber = generateUniqueBatchNumberForProduction();

  await sequelize.sync({ alter: true });
  const createQualityInspection = await ProductionQualityCheck.create({
    transaction_date: new Date(),
    production_id,
    batch_number: uniqueBatchNumber,
    checked_by_user_id,
    defects_found,
    corrective_action,
    remarks,
  });

  // Fetch associated data using `findOne`
  const upadtedProduction = await ProductionQualityCheck.findOne({
    where: { id: createQualityInspection.id },
    include: [
      {
        model: Production,
        as: "Production",
      },
    ],
  });

  res.status(200).json(upadtedProduction);
});

//@dec get Production By BatchNo
//@route GET /production/get/:batch_no
//@access public

const getProductionByBatchNo = asyncHandler(async (req, res) => {
  const { batch_number } = req.params;

  if (!batch_number) {
    res.status(400);
    throw new Error("All fields are required");
  }

  await sequelize.sync({ alter: true });
  const getProduction = await Production.findOne({
    where: { batch_number: batch_number },
    include: [
      {
        model: User,
        as: "User",
      },
      {
        model: ProductCatalogue,
        as: "ProductCatalogue",
      },
    ],
  });

  res.status(200).json(getProduction);
});

//@dec get products by item
//@route GET /production/get/:batch_no
//@access public
// needs to create

module.exports = {
  createProduction,
  updateProduction,
  createProductionMaterial,
  createQualityInspection,
  getProductionByBatchNo,
};
