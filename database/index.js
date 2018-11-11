const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const config = require("../config/database");
let database, opts = {};

// Desenvolvimento
if (process.env.NODE_ENV === "development") {
    database = `${config.development.host}/${config.development.database}`
}

// Aperte os cintos, estamos em produção...
if (process.env.NODE_ENV === "production") {
    database = `${config.production.host}/${config.production.database}`
    opts.user = config.production.user
    opts.pass = config.production.pass
}

// conecta ao mongo via mongoose
mongoose.connect(`mongodb://${database}`, opts);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
    console.log("Conexão com banco de dados aberta com sucesso em: " + database);
});

const Tools = require("./schemas/tools");

module.exports.Tools = Tools;