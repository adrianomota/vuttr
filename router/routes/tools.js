const express = require("express");
const router = express.Router();
const toolsCtrl = require("../../controllers/tools-controller");

router.get("/", toolsCtrl.retrieve);
router.post("/", toolsCtrl.create);
router.put("/:id", toolsCtrl.update);
router.delete("/:id", toolsCtrl.remove);

module.exports = router;