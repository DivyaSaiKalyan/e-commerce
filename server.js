const express = require("express");
const errorHandler = require("./middleware/errorHandler");
const dotenv = require("dotenv").config();
const { connectDB } = require("./config/dbConnection");
const catalogueRoutes = require("./routes/catalogueRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const productCatalogueRoutes = require("./routes/productCatalogueRoutes");
const orderCartRoutes = require("./routes/orderCartRoutes");
const userRoutes = require("./routes/userRoutes");
const productionRoutes = require("./routes/productionRoutes");
const storeRoutes = require("./routes/storeRoutes");
const storeInventoryRoutes = require("./routes/storeInventoryRoutes");
const bankRoutes = require("./routes/payment/bankRoutes");
const cashCenterRoutes = require("./routes/payment/cashCenterRoutes");
const currencyRoutes = require("./routes/payment/currencyRoutes");
const recipientRoutes = require("./routes/payment/recipientRoutes");
const mobileTransferRoutes = require("./routes/payment/mobileTransferRoutes");
const outboundTransferRoutes = require("./routes/payment/outboundTransferRoutes");
const inboundTransferRoutes = require("./routes/payment/inboundTransferRoutes");
const walletTransferRoutes = require("./routes/payment/walletTransferRoutes");

const app = express();

const port = process.env.PORT || 5000;

app.use(express.json());
app.use("/category", categoryRoutes);
app.use("/category/itemCatalogue", catalogueRoutes);
app.use("/category/itemCatalogue/productCatalogue", productCatalogueRoutes);
app.use("/ordercart", orderCartRoutes);
app.use("/user", userRoutes);
app.use("/production", productionRoutes);
app.use("/store", storeRoutes);
app.use("/storeinventory", storeInventoryRoutes);
app.use("/user/bank", bankRoutes);
app.use("/bank/cashcenter", cashCenterRoutes);
app.use("/bank/currency", currencyRoutes);
app.use("/bank/recipient", recipientRoutes);
app.use("/bank/modiletransfer", mobileTransferRoutes);
app.use("/bank/outboundtransfer", outboundTransferRoutes);
app.use("/bank/inboundtransfer", inboundTransferRoutes);
app.use("/bank/wallettransfer", walletTransferRoutes);
app.use(errorHandler);
connectDB();

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
