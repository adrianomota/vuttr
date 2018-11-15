const express = require("express");
const router = express.Router();
const toolsCtrl = require("../../controllers/tools-controller");

// define handlers (controllers das ferramentas) das rotas
router.get("/", toolsCtrl.retrieve);
// as tres acoes abaixo exigem um token JWT para autorizacao
router.post("/", require("../../auth").isAuthenticated, toolsCtrl.create);
router.put("/:id", require("../../auth").isAuthenticated, toolsCtrl.update);
router.delete("/:id", require("../../auth").isAuthenticated, toolsCtrl.remove);

module.exports = router;