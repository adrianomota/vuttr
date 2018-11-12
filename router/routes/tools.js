const express = require("express");
const router = express.Router();
const toolsCtrl = require("../../controllers/tools-controller");

router.get("/", toolsCtrl.retrieve);
router.post("/", toolsCtrl.create);
router.delete("/", toolsCtrl.remove);

module.exports = router;