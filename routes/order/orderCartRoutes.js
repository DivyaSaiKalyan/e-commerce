const express = require("express");
const {
  createOrderCart,
  createOrderDetails,
  createOrderCartWithDetails,
  createOrderTracking,
  createOrderCancel,
  getOrderById,
  getOrderTracking,
  getOrdersByUserId,
  getOrdersByStoreId,
} = require("../../controllers/order/orderCartController");
const router = express.Router();

router.route("/create/:user_id/:store_id").post(createOrderCart);
router.route("/createOrderDetails/:order_no").post(createOrderDetails);
router
  .route("/orderdetails/:user_id/:store_id/:product_code")
  .post(createOrderCartWithDetails);
router.route("/orderTracking/:order_no").post(createOrderTracking);
router.route("/order/cancel/:order_no").post(createOrderCancel);
router.route("/getOrder/:order_no").post(getOrderById);
router.route("/orderTracking/:order_no").post(getOrderTracking);
router.route("/userorders/:user_id").post(getOrdersByUserId);
router.route("/storeorders/:store_id").post(getOrdersByStoreId);

module.exports = router;
