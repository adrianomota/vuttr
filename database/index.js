const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const config = require("../config/database");
let url, opts = { useNewUrlParser: true };

// Desenvolvimento
if (process.env.NODE_ENV === "development") {
    url = `${config.host}/${config.database}`
}

// Desenvolvimento
if (process.env.NODE_ENV === "test") {
    url = `${config.host}/${config.database}-test`
}

// Aperte os cintos, estamos em produção...
if (process.env.NODE_ENV === "production") {
    url = `${config.host}/${config.database}`
    opts.user = config.user
    opts.pass = config.pass
}

// conecta ao mongo via mongoose
mongoose.connect(url, opts);

const Tools = require("./schemas/tools");

module.exports.Tools = Tools;