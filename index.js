const express = require('express');
const bodyParser = require('body-parser');

// express app
const app = express();

// parse content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))
// parse content-type - application/json
app.use(bodyParser.json())

// Rotas
app.use("/", require("./router")(app));

// Escutar requisicoes na porta 3000
app.listen(3000, () => {
    console.log("Servidor escutando na porta 3000");
});