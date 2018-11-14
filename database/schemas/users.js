const bcrypt = require("bcryptjs");
const isEmail = require("validator").isEmail;
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// funcao de encriptacao da senha do usuario
const crypt = (v) => bcrypt.hashSync(v, bcrypt.genSaltSync(10), null);

// schema de um usuario
var usuarioSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true, validate: [isEmail, "E-mail inválido"] },
    password: { type: String, required: true, set: crypt },
});

// helper de verificacao de senha
usuarioSchema.methods.comparePassword = function (triedPassword) {
    return bcrypt.compare(triedPassword, this.password);
};

// modelo
const UsuarioModel = mongoose.model("User", usuarioSchema, "Users");

module.exports = UsuarioModel;