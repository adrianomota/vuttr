const express = require("express");
const auth = require("../auth");
const User = require("../database/").Users;

const router = express.Router();
module.exports = () => {
    router.use("/tools", require("./routes/tools"));

    router.use("/login", auth.login);

    // cria um usuario de teste
    User.findOne({ email: "root@vuttr.co" }, (err, res) => {
        if (err) return console.log(err);
        if (!res) {
            new User({
                name: "root",
                email: "root@vuttr.co",
                password: "notAnAdminPass"
            }).save();
        }
    });

    return router;
};