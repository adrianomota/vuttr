const mongoose = require("mongoose");
const config = require("../config/database");

mongoose.Promise = global.Promise;

let url, opts = { useNewUrlParser: true };

// Desenvolvimento
if (process.env.NODE_ENV === "development") {
    url = `${config.devHost}/${config.database}`
}

// Teste
if (process.env.NODE_ENV === "test") {
    url = `${config.devHost}/${config.database}-test`
}

// Aperte os cintos, estamos em produção...
if (process.env.NODE_ENV === "production") {
    url = `${config.productionHost}/${config.database}`
    if (config.user !== "")
        opts.user = config.user;
    if (config.pass !== "")
        opts.pass = config.pass;
}

// conecta ao mongo via mongoose
mongoose.connect(url, opts);

// schemas
const Tools = require("./schemas/tools");
const Users = require("./schemas/users");

module.exports.Tools = Tools;
module.exports.Users = Users;