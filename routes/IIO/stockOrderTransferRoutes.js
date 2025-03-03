const express = require("express");
const {
  createStockOrder,
  createStockTransfer,
  getStockTransfersBySymbol,
  getPortfolioByUserId,
  getStockOrdersBySymbolAndOrderType,
} = require("../../controllers/IIO/stockorderTransfer");
const router = express.Router();

// Stock Order Routes
router.route("/order/create").post(createStockOrder);
router
  .route("/order/:symbol/:order_type")
  .post(getStockOrdersBySymbolAndOrderType);

// Stock Transfer Routes
router.route("/transfer/create").post(createStockTransfer);
router.route("/transfer/:symbol").post(getStockTransfersBySymbol);

// Stock Portfolio Route
router.route("/portfolio/:user_id").post(getPortfolioByUserId);

module.exports = router;
