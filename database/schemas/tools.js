const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// { 
//     "title": "hotel",
//     "link": "<https://github.com/typicode/hotel>",
//     "description": "Local app manager. Start apps within your browser, developer tool with local .localhost domain and https out of the box.",
//     "tags":["node", "organizing", "webapps", "domain", "developer", "https", "proxy"]
// }

const toolSchema = new Schema({
    title: {type: String, required: true},
    link: {type: String},
    description: String,
    tags: [String],
});

const ToolModel = mongoose.model("Tool", toolSchema, "Tools");

module.exports = ToolModel;
