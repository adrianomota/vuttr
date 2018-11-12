const express = require("express");
const router = express.Router();

module.exports = function (app) {
    router.use("/tools", require("./routes/tools"));

    return router;
};