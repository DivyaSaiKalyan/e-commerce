const express = require("express");
const {
  createVGCTreasury,
  updateVGCTreasury,
  getVGCTreasury,
  createLedger,
  getAllLedgers,
  createVdcStockValue,
  getStockValueByDate,
  createVdcPrice,
  getVdcPrice,
} = require("../../controllers/IIO/vgcController");
const router = express.Router();

router.route("/treasury/create").post(createVGCTreasury);
router.put("/treasury/update/:id", updateVGCTreasury);
router.get("/treasury", getVGCTreasury);
router.post("/ledger/create", createLedger);
router.post("/ledger/:from_date/:to_date", getAllLedgers);
router.post("/vdc/stock-value/create", createVdcStockValue);
router.post("/vdc/stock-value/:date", getStockValueByDate);
router.post("/vdc/price/create", createVdcPrice);
router.get("/vdc/price", getVdcPrice);

module.exports = router;
