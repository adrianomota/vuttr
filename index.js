const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');

// express app
const app = express();

// parse content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))
// parse content-type - application/json
app.use(bodyParser.json())

app.use(logger(':date[web] :method :url :status :response-time ms - :res[content-length]'));

// Rotas
app.use("/", require("./router")(app));

// Escutar requisicoes na porta 3000
app.listen(3000, () => {
    console.log("Servidor escutando na porta 3000");
});