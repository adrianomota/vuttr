const jwt = require("jsonwebtoken");
const User = require("./database/").Users;

const SECRET_KEY = "alguma chave de seguranca";

const checkPassword = res => ([comparison, user]) => {
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

const handleError = (req, res) => (err) => {
    console.err(err.name || err.message);
    return res.status(err.code || 500).json({
        error: err.name,
        message: err.message
    });
};

module.exports.login = (req, res) => {
    User.findOne({ email: req.body.email }).exec()
        .then(user => {
            if (user === null) return Promise.reject(404);
            return Promise.all([user.comparePassword(req.body.password), user]);
        })
        .then(checkPassword(res))
        .then((res) => res.status(200).json(success))
        .catch(handleError(req, res));
};

module.exports.isAuthenticated = (req, res, next) => {
    var bearerToken;
    var bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== "undefined") {
        var bearer = bearerHeader.split(" ");
        bearerToken = bearer[1];
        try {
            var payload = jwt.verify(bearerToken, C.SECRET_KEY);
            req.loggedId = payload.id;
            req.loggedPerfil = payload.perfil;
            next();
        } catch (err) {
            res.status(400).json({
                "error": err.name,
                "message": err.message
            });
        }
    } else {
        res.status(401).json({
            "ERROR": C.error["401"]
        });
    }
};