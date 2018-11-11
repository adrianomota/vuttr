const express = require("express");
const router = express.Router();
const toolsCtrl = require("../../controllers/tools-controller");

router.get("/", toolsCtrl.find);
router.post("/", toolsCtrl.post);
router.delete("/", toolsCtrl.remove);