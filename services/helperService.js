const { v4: uuidv4 } = require("uuid");

const generateInvoiceNumber = () => {
  return `INV-${uuidv4().split("-")[0].toUpperCase()}`;
};

const calculateGST = (orderAmount, gstPercentage) => {
  if (orderAmount <= 0 || gstPercentage < 0) {
    throw new Error(
      "Invalid input values. Order amount and GST percentage must be positive."
    );
  }

  const gstAmount = (orderAmount * gstPercentage) / 100;
  const totalAmount = orderAmount + gstAmount;

  return {
    orderAmount: orderAmount.toFixed(2),
    gstPercentage: gstPercentage.toFixed(2),
    gstAmount: gstAmount.toFixed(2),
    totalAmount: totalAmount.toFixed(2),
  };
};

const generateUniqueBatchNumberForProduction = () => {
  const datePart = new Date().toISOString().split("T")[0].replace(/-/g, ""); // Format: YYYYMMDD
  const randomPart = Math.floor(1000 + Math.random() * 9000); // Generate a 4-digit random number
  return `${datePart}${randomPart}`;
};

module.exports = {
  generateInvoiceNumber,
  calculateGST,
  generateUniqueBatchNumberForProduction,
};
