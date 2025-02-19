// const { sequelize } = require("./dbConnection");
// const { Category } = require("../models/Category");
// const { ItemCatalogue } = require("../models/ItemCatalogue");

// // Sync models and create tables if they don't exist
// async function syncDatabase() {
//   try {
//     await sequelize.sync({ alter: true }); // Creates or updates tables
//     console.log(" Database Synced!");

//     // Check if initial data exists
//     const users = await Category.findAll();
//     if (users.length === 0) {
//       await Category.create({
//         name: "Admin",
//         email: "admin@example.com",
//         password: "securepassword",
//       });
//       console.log("👤 Default Admin User Created");
//     }
//   } catch (error) {
//     console.error(" Database Sync Failed:", error);
//   }
// }

// syncDatabase();
