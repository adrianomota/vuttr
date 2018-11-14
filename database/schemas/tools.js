const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Schema de um documento do tipo Ferramenta
const toolSchema = new Schema({
    title: { type: String, required: true },
    link: { type: String },
    description: String,
    tags: [String],
}, { versionKey: false });

const ToolModel = mongoose.model("Tool", toolSchema, "Tools");

module.exports = ToolModel;