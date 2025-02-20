const express = require("express");
const errorHandler = require("./middleware/errorHandler");
const dotenv = require("dotenv").config();
const { connectDB } = require("./config/dbConnection");
const catalogueRoutes = require("./routes/catalogueRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const productCatalogueRoutes = require("./routes/productCatalogueRoutes");

const app = express();

const port = process.env.PORT || 5000;

app.use(express.json());
app.use("/category", categoryRoutes);
app.use("/category/itemCatalogue", catalogueRoutes);
app.use("/category/itemCatalogue/productCatalogue", productCatalogueRoutes);
app.use(errorHandler);
connectDB();

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
