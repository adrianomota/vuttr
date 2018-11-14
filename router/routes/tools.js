const express = require("express");
const router = express.Router();
const toolsCtrl = require("../../controllers/tools-controller");

router.get("/", toolsCtrl.retrieve);
router.post("/", require("../../auth").isAuthenticated, toolsCtrl.create);
router.put("/:id", require("../../auth").isAuthenticated, toolsCtrl.update);
router.delete("/:id", require("../../auth").isAuthenticated, toolsCtrl.remove);

module.exports = router;