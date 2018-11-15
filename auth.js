const jwt = require("jsonwebtoken");

const User = require("./database/").Users;
const handleError = require("./utils").handleError;

const SECRET_KEY = "alguma chave de seguranca";

/**
 * Função de assinatura do JWT
 * se resultado da checagem de senha do usuario for ok
 * define no cabeçalho da resposta (res) a propriedade
 * Authorization - OAuth 2.0 Bearer Token.
 */
const signToken = res => ([comparison, user]) => {
    if (comparison) {
        const token = jwt.sign({ id: user._id }, SECRET_KEY, {
            expiresIn: "72h"
        });
        res.set("Authorization", "Bearer " + token);
        return Promise.resolve({
            message: 'Authenticated!',
            token: token
        });
    } else {
        return Promise.reject(400);
    }
};

/**
 * Faz login do usuario
 * Busca usuario pelo e-mail, verifica senha e
 * retorna um token JWT
 */
module.exports.login = (req, res) => {
    const password = req.body.password;
    User.findOne({ email: req.body.email }).exec()
        .then(user => {
            if (user === null) return Promise.reject(404);
            // usa helper de comparacao de senhas (comparaPassword)
            return Promise.all([user.comparePassword(password), user]);
        })
        .then(signToken(res))
        .then(success => res.status(200).json(success))
        .catch(handleError(res));
};

/**
 * Função de checagem de validade do token
 * Usada como middlware das rotas que necessitem autorizacao
 */
module.exports.isAuthenticated = (req, res, next) => {
    var bearerToken;
    var bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== "undefined") {
        var bearer = bearerHeader.split(" ");
        bearerToken = bearer[1];
        try {
            var payload = jwt.verify(bearerToken, SECRET_KEY);
            req.loggedId = payload.id;
            req.loggedPerfil = payload.perfil;
            next();
        } catch (err) {
            handleError(res)(err, 400);
        }
    } else {
        handleError(res)("Token indefinida", 400);
    }
};