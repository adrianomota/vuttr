const express = require("express");
const auth = require("../auth");

const router = express.Router();
module.exports = () => {
    router.use("/tools", require("./routes/tools"));

    router.use("/login", auth.login);

    return router;
};