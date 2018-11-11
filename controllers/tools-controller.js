var Tools = require("../database").Tools;

module.exports.create = function (req, res) {
    let newTool = new Tools(req.body);
    newTool.save(function (err) {
        if (err) {
            res.status(409).json({
                "ERROR": {
                    "error": err.name,
                    "message": err.message
                }
            });
        } else {
            res.status(200).json(newTool);
        }
    });
};

module.exports.find = function (req, res) {
    let tag = req.query.tag;
    Tools.find({ tag }, function (err, results) {
        if (err) {
            res.status(409).json({
                "ERROR": {
                    "error": err.name,
                    "message": err.message
                }
            });
        } else {
            res.status(200).json(results);
        }
    });
};

module.exports.remove = function (req, res) {
    Local.findOneAndRemove({ _id: req.params.id }, function (err, local) {
        if (err) {
            res.status(409).json({
                "ERROR": {
                    "error": err.name,
                    "message": err.message
                }
            });
        } else {
            res.status(200).json({});
        }
    });
};