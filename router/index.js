const express = require("express");
const router = express.Router();

module.exports = function (app) {
    router.get("/", function (req, res) {
        res.render('index.html');
    });

    app.use("/tools", require("./routes/tools"));
};