const Tool = require("../database").Tools;

function handleError(res, err, code) {
    return res.status(code).json({
        "ERROR": {
            "error": err.name,
            "message": err.message
        }
    });
}

module.exports.create = function (req, res) {
    let newTool = new Tool(req.body);
    newTool.save(function (err) {
        if (err) return handleError(res, err, 400);
        res.status(201).json(newTool);
    });
};

module.exports.retrieve = function (req, res) {
    let tag = req.query.tag;
    let query = {};
    if (tag)
        query.tags = tag;
    Tool.find(query, function (err, results) {
        if (err) return handleError(res, err, 400);
        res.status(200).json(results);
    });
};

module.exports.update = function (req, res) {
    let tool = req.body;
    let id = req.params.id;
    Tool.findByIdAndUpdate(id, { $set: tool }, { new: true }, function (err, tool) {
        if (err) return handleError(res, err, 400);
        res.status(200).json(tool);
    });
};

module.exports.remove = function (req, res) {
    let id = req.params.id;
    Tool.findByIdAndDelete(id, function (err) {
        if (err) return handleError(res, err, 400);
        res.status(200).json({});
    });
};