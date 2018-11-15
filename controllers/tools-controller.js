const Tool = require("../database").Tools;

const handleError = require("../utils").handleError;

/**
 * responde uma requisicao POST para cadastrar uma nova ferramenta
 */
module.exports.create = function (req, res) {
    let newTool = new Tool(req.body);
    newTool.save(function (err) {
        if (err) return handleError(res)(err, 400);
        res.status(201).json(newTool.toJSON());
    });
};

/**
 * responde uma requisicao GET para listar ferramentas
 * filtra por tags
 */
module.exports.retrieve = function (req, res) {
    let tag = req.query.tag;
    let query = {};
    if (tag)
        query.tags = tag;
    Tool.find(query, { _id: false }, function (err, results) {
        if (err) return handleError(res)(err, 400);
        res.status(200).json(results.map(r => r.toJSON()));
    });
};

/**
 * responde uma requisicao PUT para atualizar uma nova ferramenta a partir de seu id
 */
module.exports.update = function (req, res) {
    let tool = req.body;
    let query = { id: req.params.id };
    Tool.findOneAndUpdate(query, { $set: tool }, { new: true }, function (err, tool) {
        if (err) return handleError(res)(err, 400);
        res.status(200).json(tool);
    });
};

/**
 * responde uma requisicao DELETE para remover uma ferramenta a partir de seu id
 */
module.exports.remove = function (req, res) {
    let id = req.params.id;
    Tool.findOneAndDelete({ id }, function (err, result) {
        if (err) return handleError(res)(err, 400);
        res.status(200).json({});
    });
};