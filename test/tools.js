process.env.NODE_ENV = "test";

const chai = require("chai");
const chaiHttp = require("chai-http");
const chaid = require("chaid");

const server = require("../server");
const Tool = require("../database").Tools;

chai.should();
chai.use(chaiHttp);
chai.use(chaid);

// fixtures
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
let _token;

/**
 * Teste dos endpoint da API.
 * Testes usando a biblioteca chai - permite um codigo semantico, auto-explicativo
 */
describe("Tools - API test: ", function () {
    // executa drop da coleçao do banco
    beforeEach(async function () {
        let count = await Tool.countDocuments();
        (count > 0) ? await Tool.collection.drop() : Promise.resolve();
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
                response.body.forEach(tool => {
                    tool.should.have.all.keys("id", "title", "description", "link", "tags");
                    let eqTool = tools.find(t => t.tags.includes('fake'));
                    tool.title.should.equal(eqTool.title);
                    tool.link.should.equal(eqTool.link);
                    tool.description.should.equal(eqTool.description);
                    tool.tags.should.include.members(eqTool.tags);
                });
                done();
            });
    });

    it("Faz login usando endpoint POST /login", done => {
        chai.request(server)
            .post("/login")
            .send(require("../config/login"))
            .end((err, response) => {
                if (err) done(err);

                response.should.have.status(200);
                response.body.should.have.any.keys(["token"]);
                response.headers.should.have.property("authorization");
                response.headers.authorization.should.be.a("string");
                _token = response.headers.authorization.split(" ")[1];
                done();
            });
    });

    it("Cadastra uma ferramenta usando POST /tools", done => {
        // dados da ferramenta para enviar no corpo da requisicao
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
            .set("Authorization", `Bearer ${_token}`) // token de autorizacao
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
                response.body.should.be.an("array")
                    .and.have.lengthOf(tools.length);
                response.body.forEach(tool =>
                    tool.should.have.all.keys("id", "title", "description", "link", "tags"));
                return Promise.resolve(response.body[0].id);
            }).then(id => {
                const newDescription = "A new description";
                chai.request(server)
                    .put(`/tools/${id}`)
                    .set("Authorization", `Bearer ${_token}`) // token de autorizacao
                    .send({ "description": newDescription }) // corpo do PUT com nova descricao
                    .end((err, response) => {
                        if (err) return done(err);

                        response.should.have.status(200).and.be.json;
                        response.body.should.have.all.keys("id", "title", "description", "link", "tags");
                        // descricao deve ser igual a nova descricao enviada
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
                    .set("Authorization", `Bearer ${_token}`) // token de autorizacao
                    .end((err, response) => {
                        if (err) return done(err);

                        response.should.have.status(200).and.be.json;
                        response.body.should.be.empty;
                        done();
                    });
            }).catch(done);
    });

    it("Não remove uma ferramenta sem token de autorizacao em DELETE /tools/:id", done => {
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
                // nao define token de autorizacao
                chai.request(server)
                    .delete(`/tools/${id}`)
                    .end((err, response) => {
                        if (err) return done(err);

                        // acao nao autorizada - bad request 400
                        response.should.have.status(400).and.be.json
                        done();
                    });
            }).catch(done);
    });
});