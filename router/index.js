const express = require("express");
const auth = require("../auth");
const User = require("../database/").Users;
const _root = require("../config/login");

const router = express.Router();
module.exports = () => {
    // endpoints da API
    router.use("/tools", require("./routes/tools"));
    // rota de login simples com email e senha
    router.post("/login", auth.login);

    // cria um usuario de teste
    User.findOne({ email: _root.email }).exec()
        .then(res => {
            if (!res) {
                new User(_root).save();
            }
        }).catch(console.error);

    return router;
};