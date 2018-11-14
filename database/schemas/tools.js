const mongoose = require("mongoose");
const MongooseAutoIncrementID = require("mongoose-auto-increment-reworked").MongooseAutoIncrementID;

// Schema de um documento do tipo Ferramenta
const toolSchema = new mongoose.Schema({
    title: { type: String, required: true },
    link: { type: String },
    description: String,
    tags: [String],
}, { versionKey: false });

// define uma funcao de transformacao para suprimir o _id (padrao do mongo) 
// dos documentos na hora da conversao para JSON
toolSchema.set("toJSON", {
    transform: (doc, ret, options) => {
        // remove o _id dos documentos antes de retornar
        delete ret._id;
    }
});

// Plugin de auto-incremento por uma propriedade "id" mais human-readable
const plugin = new MongooseAutoIncrementID(toolSchema, "Tool", {
    field: "id", // id auto incremental
    incrementBy: 1, // ids numerados de 1 em 1
    nextCount: false, // Nao ha interesse em saber o proximo id
    startAt: 1, // Inicia em 1
});
plugin.applyPlugin();
toolSchema.plugin(MongooseAutoIncrementID.plugin, { modelName: "Tool" });

const ToolModel = mongoose.model("Tool", toolSchema, "Tools");

module.exports = ToolModel;