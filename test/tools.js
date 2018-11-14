process.env.NODE_ENV = "test";

const chai = require("chai");
const chaiHttp = require("chai-http");
const chaid = require("chaid");

const server = require("../server");
const Tool = require("../database").Tools;

chai.should();
chai.use(chaiHttp);
chai.use(chaid);

let tools = [
    {
        "title": "fake-tool",
        "link": "<https://fakeaddress.co>",
        "description": "Fake tool",
        "tags": [
            "fake",
            "github",
            "rest",
        ]
    }, {
        "title": "json-server",
        "link": "<https://github.com/typicode/json-server>",
        "description": "Fake REST API based on a json schema. Useful for mocking and creating APIs for front-end devs to consume in coding challenges.",
        "tags": [
            "api",
            "json",
            "schema",
            "node",
            "github",
            "rest",
        ]
    }, {
        "title": "fastify",
        "link": "<https://www.fastify.io/>",
        "description": "Extremely fast and simple, low-overheadweb framework for NodeJS. Supports HTTP2.",
        "tags": [
            "web",
            "framework",
            "node",
            "http2",
            "https",
            "localhost"
        ]
    }
];

/**
 * Teste dos endpoint da API.
 * Testes usando a biblioteca chai - permite um codigo semantico, auto-explicativo
 */
describe("Tools - API test: ", function () {
    // executa drop da coleçao do banco
    beforeEach(async function () {
        let count = await Tool.countDocuments();
        await ((count > 0) ? Tool.collection.drop() : Promise.resolve());
        await Tool._resetCount(); // reseta contador auto-incremental dos ids
        await Tool.create(tools); // fixtures das 3 ferramentas acima para testes
    });

    it("Lista as ferramentas usando GET /tools", done => {
        chai.request(server)
            .get("/tools")
            .end((err, response) => {
                if (err) return done(err);

                response.should.have.status(200);
                response.body.should.be.an("array").and.have.lengthOf(tools.length)

                // cada ferramenta deve ter uma propriedade id
                response.body.forEach(tool => {
                    tool.should.have.all.keys("id", "title", "description", "link", "tags");
                    // acha nas variavel de ferramentas salvas a equivalente do resultado
                    let eqTool = tools.find(u => u.title === tool.title);
                    // testa se titulos sao iguais
                    tool.title.should.equal(eqTool.title);
                    // testa se links sao iguais
                    tool.link.should.equal(eqTool.link);
                    // testa se descricoes sao iguais
                    tool.description.should.equal(eqTool.description);
                    // testa se tags sao iguais
                    tool.tags.should.include.members(eqTool.tags);
                });
                done();
            });
    });

    it("Filtra as ferramentas usando GET /tools", done => {
        chai.request(server)
            .get("/tools")
            .query({ tag: "fake" }) // busca por fake (so inserimos uma ferramenta com essa tag)
            .end((err, response) => {
                if (err) return done(err);

                response.should.have.status(200).and.be.json;
                response.body.should.be.an("array").and.have.lengthOf(1)

                // cada ferramenta deve ter todas as propriedades
                response.body[0].should.have.all.keys("id", "title", "description", "link", "tags");
                let eqTool = tools.find(t => t.tags.includes('fake'));
                response.body[0].title.should.equal(eqTool.title);
                response.body[0].link.should.equal(eqTool.link);
                response.body[0].description.should.equal(eqTool.description);
                response.body[0].tags.should.include.members(eqTool.tags);
                done();
            });

    });

    it("Cadastra uma ferramenta usando POST /tools", done => {
        let newTool = {
            "title": "Notion",
            "link": "<https://notion.so>",
            "description": "All in one tool to organize teams and ideas. Write, plan, collaborate, and get organized. ",
            "tags": [
                "organization",
                "planning",
                "collaboration",
                "writing",
                "calendar"
            ]
        };
        chai.request(server)
            .post("/tools")
            .send(newTool)
            .end((err, response) => {
                if (err) return done(err);

                response.should.have.status(201).and.be.json;
                response.body.should.have.keys("id", "title", "description", "link", "tags");

                // nova ferramenta deve ter uma propriedade id
                response.body.id.should.be.an("number");

                response.body.title.should.equal(newTool.title);
                response.body.link.should.equal(newTool.link);
                response.body.description.should.equal(newTool.description);
                response.body.tags.should.be.an("array").and.have.lengthOf(newTool.tags.length);
                response.body.tags[0].should.equal(newTool.tags[0]);

                done();
            });
    });

    it("Atualiza a descricao de uma ferramenta usando PUT /tools/:id", done => {
        chai.request(server)
            .get("/tools")
            .then(response => {
                response.should.have.status(200);
                response.should.be.json;
                response.body.forEach(tool => tool.should.have.all.keys("id", "title", "description", "link", "tags"));
                return Promise.resolve(response.body[0].id);
            }).then(id => {
                const newDescription = "A new description";
                chai.request(server)
                    .put(`/tools/${id}`)
                    .send({ "description": newDescription })
                    .end((err, response) => {
                        if (err) return done(err);

                        response.should.have.status(200).and.be.json;
                        response.body.should.have.all.keys("id", "title", "description", "link", "tags");
                        response.body.description.should.equal(newDescription);
                        done();
                    });
            }).catch(done);
    });

    it("Remove uma ferramenta usando DELETE /tools/:id", done => {
        chai.request(server)
            .get("/tools")
            .then(response => {
                response.should.have.status(200);
                response.should.be.json;
                response.body.should.be.an("array")
                    .and.have.lengthOf(tools.length);
                response.body.forEach(tool =>
                    tool.should.have.all.keys("id", "title", "description", "link", "tags"));
                return Promise.resolve(response.body[0].id);
            }).then(id => {
                chai.request(server)
                    .delete(`/tools/${id}`)
                    .end((err, response) => {
                        if (err) return done(err);

                        response.should.have.status(200).and.be.json
                        response.body.should.be.empty;
                        done();
                    });
            }).catch(done);
    });
});