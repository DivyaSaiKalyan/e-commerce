const asyncHandler = require("express-async-handler");
const { sequelize } = require("../config/dbConnection");
const {
  generateInvoiceNumber,
  calculateGST,
} = require("../services/helperService");
const OrderCartDetails = require("../models/eCommerce/orderCartDetails");
const OrderTracking = require("../models/eCommerce/orderTracking");
const OrderCancel = require("../models/eCommerce/orderCancel");
const ProductCatalogue = require("../models/eCommerce/productCatalogue");
const DeliveryAddress = require("../models/eCommerce/deliveryAddress");
const OrderCart = require("../models/eCommerce/orderCart");
const Store = require("../models/Production/store");
const User = require("../models/User/user");

//@dec create order cart
//@route POST /user/orderCart
//@access public
const createOrderCart = asyncHandler(async (req, res) => {
  const { user_id, store_id } = req.params;

  if (!user_id || !store_id) {
    res.status(400);
    throw new Error("All fields are required");
  }
  const user = await User.findByPk(user_id);
  if (!user) {
    res.status(400);
    throw new Error("User not found");
  }
  const store = await Store.findByPk(store_id);
  if (!store) {
    res.status(400);
    throw new Error("Store not found");
  }
  const {
    order_type,
    order_amount,
    loyalty_coins,
    order_delivery_address_id,
    order_delivery_user_id,
  } = req.body;

  if (
    !order_type ||
    !order_amount ||
    !loyalty_coins ||
    !order_delivery_address_id ||
    !order_delivery_user_id
  ) {
    res.status(400);
    throw new Error("All fields are required");
  }

  const uniqueInvoiceNumber = generateInvoiceNumber();
  const { totalAmount, gstAmount } = calculateGST(order_amount, 18); // 1000rs , 18%

  await sequelize.sync({ alter: true });
  await OrderCart.create({
    user_id: user_id,
    store_id: store_id,
    order_type: order_type,
    invoice_no: uniqueInvoiceNumber,
    order_amount: order_amount,
    gst_amount: gstAmount,
    total_amount: totalAmount,
    loyalty_coins: loyalty_coins,
    order_delivery_address_id: order_delivery_address_id,
    order_delivery_user_id: order_delivery_user_id,
  });

  const newOrderCartDetails = await OrderCart.findAll({
    where: {
      invoice_no: uniqueInvoiceNumber,
    },
    attributes: [
      "id",
      "invoice_no",
      "order_date",
      "order_type",
      "order_amount",
      "gst_amount",
      "total_amount",
      "loyalty_coins",
      "order_delivery_address_id",
      "order_delivery_user_id",
    ],
    include: [
      {
        model: User,
        attributes: [
          "user_id",
          "first_name",
          "last_name",
          "email_id",
          "gender",
          "profile_image",
          "marital_status",
          "mobile_number",
          "area_code",
        ],
      },
      {
        model: Store,
        attributes: [
          "store_id",
          "store_name",
          "store_type",
          "area_code",
          "store_address",
          "contact_number",
          "email_id",
        ],
      },
    ],
  });

  if (newOrderCartDetails) {
    res.status(200).json({
      success: true,
      data: newOrderCartDetails,
    });
  }
});

//@dec create order details
//@route POST /user/orderCart
//@access public
const createOrderDetails = asyncHandler(async (req, res) => {
  const { order_no } = req.params;

  if (!order_no) {
    res.status(400);
    throw new Error("All fields are required");
  }
  const getOrder = await OrderCart.findByPk(order_no);
  if (!getOrder) {
    res.status(400);
    throw new Error("Order not found");
  }

  const { code, quantity, gst_amount } = req.body;

  if (!code || !quantity || !gst_amount) {
    res.status(400);
    throw new Error("All fields are required**********");
  }
  const productInfo = await ProductCatalogue.findByPk(code);
  if (!productInfo) {
    res.status(400);
    throw new Error("Product not found");
  }

  const { product_code, product_price } = productInfo;
  console.log(product_code, product_price);
  const calculateTotalPrice = product_price * quantity;
  const calculateGSTAmountPerUnit = product_price * (gst_amount / 100);
  const calculateGSTAmountForAllUnits = calculateGSTAmountPerUnit * quantity;
  const total = calculateTotalPrice + calculateGSTAmountForAllUnits;

  await sequelize.sync({ alter: true });
  await OrderCartDetails.create({
    order_no: order_no,
    product_code: product_code,
    unit_price: product_price,
    quantity: quantity,
    gst_amount: gst_amount,
    total_price: total,
  });

  const orderDetails = await OrderCartDetails.findOne({
    where: {
      order_no: order_no,
    },
    attributes: ["unit_price", "quantity", "gst_amount", "total_price"],
    include: [
      {
        model: ProductCatalogue,
        attributes: [
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
        ],
      },
      {
        model: OrderCart,
        attributes: [
          "order_type",
          "order_amount",
          "gst_amount",
          "total_amount",
        ],
      },
    ],
  });

  res.status(200).json(orderDetails);
});

//@dec create order cart with details
//@route POST /user/ordercart/orderdetails/
//@access public
const createOrderCartWithDetails = asyncHandler(async (req, res) => {
  const { user_id, store_id, product_code } = req.params;

  if (!user_id || !store_id || !product_code) {
    res.status(400);
    throw new Error("All fields are required");
  }
  const user = await User.findByPk(user_id);
  if (!user) {
    res.status(400);
    throw new Error("User not found");
  }
  const store = await Store.findByPk(store_id);
  if (!store) {
    res.status(400);
    throw new Error("Store not found");
  }
  const productInfo = await ProductCatalogue.findByPk(product_code);
  if (!productInfo) {
    res.status(400);
    throw new Error("Product not found");
  }
  const {
    order_type,
    order_amount,
    loyalty_coins,
    order_delivery_address_id,
    order_delivery_user_id,
    quantity,
    gst_amount,
  } = req.body;

  if (
    !order_type ||
    !order_amount ||
    !loyalty_coins ||
    !order_delivery_address_id ||
    !order_delivery_user_id ||
    !quantity ||
    !gst_amount
  ) {
    res.status(400);
    throw new Error("All fields are required");
  }

  const uniqueInvoiceNumber = generateInvoiceNumber();
  const { totalAmount, gstAmount } = calculateGST(order_amount, 18); // 1000rs , 18%

  await sequelize.sync({ alter: true });
  const newOrderCart = await OrderCart.create({
    user_id: user_id,
    store_id: store_id,
    order_type: order_type,
    invoice_no: uniqueInvoiceNumber,
    order_amount: order_amount,
    gst_amount: gstAmount,
    total_amount: totalAmount,
    loyalty_coins: loyalty_coins,
    order_delivery_address_id: order_delivery_address_id,
    order_delivery_user_id: order_delivery_user_id,
  });

  const { id } = newOrderCart.dataValues;
  const getOrder = await OrderCart.findByPk(id);
  if (!getOrder) {
    res.status(400);
    throw new Error("Order not found");
  }

  const { product_price } = productInfo;
  const calculateTotalPrice = product_price * quantity;
  const calculateGSTAmountPerUnit = product_price * (gst_amount / 100);
  const calculateGSTAmountForAllUnits = calculateGSTAmountPerUnit * quantity;
  const total = calculateTotalPrice + calculateGSTAmountForAllUnits;

  await sequelize.sync({ alter: true });
  await OrderCartDetails.create({
    order_no: getOrder.id,
    product_code: product_code,
    unit_price: product_price,
    quantity: quantity,
    gst_amount: gst_amount,
    total_price: total,
  });

  const orderCartAndDetails = await OrderCart.findOne({
    where: {
      user_id: user_id,
    },
    include: [
      {
        model: User,
        as: "User",
      },
      {
        model: Store,
        as: "Store",
      },
      {
        model: OrderCartDetails,
        as: "order_details",
      },
    ],
  });

  if (orderCartAndDetails) {
    res.status(200).json({
      statusMessage: "success",
      statusCode: 200,
      message: "Order cart and details created successfully",
      data: orderCartAndDetails,
    });
  }
});

//@dec create order tracking
//@route POST /user/orderCart/orderTracking
//@access public
const createOrderTracking = asyncHandler(async (req, res) => {
  const { order_no } = req.params;

  if (!order_no) {
    res.status(400);
    throw new Error("All fields are required");
  }

  const getOrder = await OrderCart.findByPk(order_no);
  if (!getOrder) {
    res.status(400);
    throw new Error("Order not found");
  }
  const { current_location, delivery_attempts, message } = req.body;

  if (!current_location || !delivery_attempts || !message) {
    res.status(400);
    throw new Error("All fields are required");
  }

  await sequelize.sync({ alter: true });
  await OrderTracking.create({
    order_no: order_no,
    current_location: current_location,
    delivery_attempts: delivery_attempts,
    message: message,
  });

  const orderTracking = await OrderTracking.findOne({
    where: {
      order_no: order_no,
    },
    attributes: [
      "order_tracking_date",
      "current_location",
      "delivery_attempts",
      "message",
    ],
    include: [
      {
        model: OrderCart,
        attributes: [
          "order_date",
          "order_type",
          "invoice_no",
          "order_amount",
          "gst_amount",
          "total_amount",
          "order_status",
        ],
        include: [
          {
            model: User,
            attributes: [
              "user_id",
              "first_name",
              "email_id",
              "mobile_number",
              "lat_location",
              "lng_location",
              "profile_image",
            ],
          },
          {
            model: DeliveryAddress,
            attributes: [
              "address_type",
              "house_no",
              "area_name",
              "land_mark",
              "city",
              "state",
              "country",
              "postal_code",
            ],
          },
          {
            model: Store,
            attributes: [
              "store_name",
              "email_id",
              "contact_number",
              "store_address",
            ],
          },
        ],
      },
    ],
    order: [["delivery_attempts", "DESC"]], // Latest records first
  });

  res.status(200).json(orderTracking);
});

//@dec create order cancel
//@route POST /user/orderCart/cancel
//@access public
const createOrderCancel = asyncHandler(async (req, res) => {
  const { order_no } = req.params;
  const { reason } = req.body;

  if (!order_no) {
    res.status(400);
    throw new Error("All fields are required");
  }

  const getOrder = await OrderCart.findByPk(order_no);
  if (!getOrder) {
    res.status(400);
    throw new Error("Order not found");
  }

  await sequelize.sync({ alter: true });
  const orderCancel = await OrderCancel.create({
    order_no: order_no,
    reason: reason,
  });

  res.status(200).json(orderCancel);
});

//@dec create order cancel
//@route POST /user/orderCart/cancel
//@access public
const updateOrderCart = asyncHandler(async (req, res) => {
  const { order_no } = req.params;
  const { order_status } = req.body;

  if (!order_no) {
    res.status(400);
    throw new Error("All fields are required");
  }

  const getOrder = await OrderCart.findByPk(order_no);
  if (!getOrder) {
    res.status(400);
    throw new Error("Order not found");
  }

  await sequelize.sync({ alter: true });
  const updateOrderCart = await OrderCart.update({
    order_status: order_status,
  });
});

//@dec get order by id
//@route GTE /user/orderCart/getOrder/:order_no
//@access public
const getOrderById = asyncHandler(async (req, res) => {
  const { order_no } = req.params;

  if (!order_no) {
    res.status(400);
    throw new Error("All fields are required");
  }
  const getOrder = await OrderCart.findAll({
    where: {
      id: order_no,
    },
    attributes: [
      "invoice_no",
      "order_date",
      "order_type",
      "order_amount",
      "gst_amount",
      "total_amount",
      "loyalty_coins",
      "order_payment_date",
      "store_accept_date",
      "store_dispatch_date",
      "order_delivery_date",
      "order_delivery_address_id",
      "order_delivery_user_id",
      "order_status",
      "customer_otp",
      "store_otp",
    ],
    include: [
      {
        model: User,
        attributes: [
          "user_id",
          "first_name",
          "last_name",
          "fh_name",
          "email_id",
          "gender",
          "profile_image",
          "marital_status",
          "mobile_number",
          "area_code",
          "country_code",
          "lat_location",
          "lng_location",
        ],
      },
      {
        model: Store,
        attributes: [
          "store_id",
          "store_name",
          "store_type",
          "area_code",
          "store_address",
          "contact_number",
          "email_id",
          "lat_location",
          "lng_location",
          "about_store",
        ],
      },
    ],
  });

  if (getOrder.length === 0) {
    res.status(400);
    throw new Error("Order not found");
  }

  res.status(200).json(getOrder);
});

//@dec get order tracking by order no
//@route GTE /user/orderCart/orderTracking/:order_no
//@access public
const getOrderTracking = asyncHandler(async (req, res) => {
  const { order_no } = req.params;

  if (!order_no) {
    res.status(400);
    throw new Error("All fields are required");
  }

  const orderTracking = await OrderTracking.findOne({
    where: {
      order_no: order_no,
    },
    attributes: [
      "id",
      "order_tracking_date",
      "current_location",
      "delivery_attempts",
      "message",
    ],
    include: [
      {
        model: OrderCart,
        attributes: [
          "id",
          "invoice_no",
          "order_date",
          "order_type",
          "order_amount",
          "gst_amount",
          "total_amount",
          "loyalty_coins",
          "order_delivery_address_id",
          "order_delivery_user_id",
        ],
        include: [
          {
            model: User,
            attributes: [
              "user_id",
              "first_name",
              "last_name",
              "email_id",
              "gender",
              "profile_image",
              "marital_status",
              "mobile_number",
              "area_code",
            ],
          },
          {
            model: Store,
            attributes: [
              "store_id",
              "store_name",
              "store_type",
              "area_code",
              "store_address",
              "contact_number",
              "email_id",
            ],
          },
        ],
      },
    ],
  });

  if (orderTracking.length === 0) {
    res.status(400);
    throw new Error("Order not found");
  }

  res.status(200).json(orderTracking);
});

//@dec get orders by user id
//@route GTE /orderCart/userorders/:user_id
//@access public
const getOrdersByUserId = asyncHandler(async (req, res) => {
  const { user_id } = req.params;

  if (!user_id) {
    res.status(400);
    throw new Error("All fields are required");
  }

  const orders = await OrderCart.findAll({
    where: {
      user_id: user_id,
    },
    attributes: [
      "id",
      "order_date",
      "order_type",
      "invoice_no",
      "order_amount",
      "gst_amount",
      "total_amount",
      "loyalty_coins",
      "order_delivery_user_id",
      "order_status",
      "order_payment_date",
      "store_accept_date",
      "store_dispatch_date",
      "order_delivery_date",
      "customer_otp",
      "store_otp",
    ],
    include: [
      {
        model: User,
        attributes: [
          "user_id",
          "first_name",
          "last_name",
          "fh_name",
          "email_id",
          "gender",
          "profile_image",
          "marital_status",
          "mobile_number",
          "area_code",
          "country_code",
          "lat_location",
          "lng_location",
        ],
      },
      {
        model: Store,
        attributes: [
          "store_id",
          "store_name",
          "store_type",
          "area_code",
          "store_address",
          "contact_number",
          "email_id",
          "lat_location",
          "lng_location",
          "about_store",
        ],
      },
    ],
  });

  // Check if orders exist
  if (!orders || orders.length === 0) {
    return res.status(404).json({ message: "No orders found for this user" });
  }

  // Extract user details from the first order
  const user = orders[0].User ? orders[0].User.toJSON() : null;

  // Remove user details from each order object to avoid redundancy
  const orderList = orders.map((order) => {
    const orderData = order.toJSON();
    delete orderData.User; // Remove duplicate user info
    return orderData;
  });

  // Send the response
  return res.status(200).json({ user, orders: orderList });
});

//@dec get orders by store id
//@route GTE /orderCart/storeorders/:user_id
//@access public
const getOrdersByStoreId = asyncHandler(async (req, res) => {
  const { store_id } = req.params;

  if (!store_id) {
    res.status(400);
    throw new Error("All fields are required");
  }

  const orders = await OrderCart.findAll({
    where: {
      store_id: store_id,
    },
    attributes: [
      "id",
      "order_date",
      "order_type",
      "invoice_no",
      "order_amount",
      "gst_amount",
      "total_amount",
      "loyalty_coins",
      "order_delivery_user_id",
      "order_status",
      "order_payment_date",
      "store_accept_date",
      "store_dispatch_date",
      "order_delivery_date",
      "customer_otp",
      "store_otp",
    ],
    include: [
      {
        model: User,
        attributes: [
          "user_id",
          "first_name",
          "last_name",
          "fh_name",
          "email_id",
          "gender",
          "profile_image",
          "marital_status",
          "mobile_number",
          "area_code",
          "country_code",
          "lat_location",
          "lng_location",
        ],
      },
      {
        model: Store,
        attributes: [
          "store_id",
          "store_name",
          "store_type",
          "area_code",
          "store_address",
          "contact_number",
          "email_id",
          "lat_location",
          "lng_location",
          "about_store",
        ],
      },
    ],
  });

  // Check if orders exist
  if (!orders || orders.length === 0) {
    return res.status(404).json({ message: "No orders found for this store" });
  }

  // Extract user details from the first order
  const store = orders[0].Store ? orders[0].Store.toJSON() : null;

  // Remove user details from each order object to avoid redundancy
  const orderList = orders.map((order) => {
    const orderData = order.toJSON();
    delete orderData.Store; // Remove duplicate user info
    return orderData;
  });
  // Send the response
  return res.status(200).json({ store, orders: orderList });
});

module.exports = {
  createOrderCart,
  createOrderDetails,
  createOrderTracking,
  createOrderCancel,
  getOrderById,
  getOrderTracking,
  getOrdersByUserId,
  getOrdersByStoreId,
  createOrderCartWithDetails,
};
