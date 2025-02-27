const express = require("express");
const { startTempNode, createWallet } = require("../controllers/knuctController");

const router = express.Router();

router.get("/starttempnode", startTempNode);
router.post("/createwallet", createWallet);

module.exports = router;
