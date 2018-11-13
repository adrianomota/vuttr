process.env.NODE_ENV = "test";

const chai = require("chai");
const chaiHttp = require("chai-http");
const chaid = require("chaid");
const should = chai.should();

const server = require("../server");
const Tool = require("../database").Tools;

chai.use(chaiHttp);
chai.use(chaid);

let tools = [
    new Tool({
        "title": "json-server",
        "link": "<https://github.com/typicode/json-server>",
        "description": "Fake REST API based on a json schema. Useful for mocking and creating APIs for front-end devs to consume in coding challenges.",
        "tags": [
            "api",
            "json",
            "schema",
            "node",
            "github",
            "rest"
        ]
    }), new Tool({
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
    })
];


describe("Tools - API test: ", function () {
    // executa drop da coleçao do banco
    beforeEach(done => {
        Tool.countDocuments()
            .then(count => (count > 0) ? Tool.collection.drop() : Promise.resolve())
            .then(() => Promise.all(tools.map(t => t.save())))
            .then(() => done())
            .catch(done);
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

                console.log(response.status);
                response.should.have.status(200);
                response.should.be.json;
                response.body.should.have.keys("_id", "title", "description", "link", "tags");

                // nova ferramenta deve ter uma propriedade id
                response.body._id.should.be.an("string");

                // testa valor de 'title'
                response.body.title.should.equal(newTool.title);

                // testa valor de 'link'
                response.body.link.should.equal(newTool.link);

                // testa valor de 'description'
                response.body.description.should.equal(newTool.description);

                // testa valores de 'tags'
                response.body.tags.should.be.an("array").and.have.lengthOf(newTool.tags.length);
                response.body.tags[0].should.equal(newTool.tags[0]);

                done();
            });
    });

    it("Lista as ferramentas usando GET /tools", done => {
        chai.request(server)
            .get("/tools")
            .end((err, response) => {
                if (err) return done(err);

                response.should.have.status(200);
                response.should.be.json;
                response.body.should.be.an("array").and.have.lengthOf(tools.length)

                // cada ferramenta deve ter uma propriedade id
                response.body.should.all.have.keys("_id", "title", "description", "link", "tags");
                response.body.forEach(t => {
                    let eqTool = tools.find(u => u.title === t.title);
                    tool.title.should.equal(eqTool.title);
                    tool.link.should.equal(eqTool.link);
                    tool.description.should.equal(eqTool.description);
                    tool.tags.should.include.members(eqTool.tags);
                });
                done();
            });
    });

    it("Filtra as ferramentas usando GET /tools", done => {
        const tag = tools[0].tags[0];
        chai.request(server)
            .get(`/tools?tags=${tag}`)
            .end((err, response) => {
                if (err) return done(err);

                response.should.have.status(200);
                response.should.be.json;
                response.body.should.be.an("array").and.have.lengthOf(1)

                // cada ferramenta deve ter todas as propriedades
                response.body.should.all.have.keys("_id", "title", "description", "link", "tags");
                let eqTool = tools[0];
                response.body[0].title.should.equal(eqTool.title);
                response.body[0].link.should.equal(eqTool.link);
                response.body[0].description.should.equal(eqTool.description);
                response.body[0].tags.should.include.members(eqTool.tags);
                done();
            });

    });

    it("Atualiza a descricao de uma ferramenta usando PUT /tools/:id", done => {
        const testUpdate = (id) => {
            const newDescription = "A new description";
            chai.request(server)
                .put(`/tools/${id}`)
                .send({ "description": newDescription })
                .end((err, response) => {
                    if (err) return done(err);

                    response.should.have.status(200);
                    response.should.be.json;
                    response.body.should.all.have.keys("_id", "title", "description", "link", "tags");
                    response.body.description.should.equal(newDescription);
                    done();
                });
        };

        chai.request(server)
            .get("/tools")
            .end((err, response) => {
                if (err) return done(err);

                response.should.have.status(200);
                response.should.be.json;
                response.body.should.be.an("array").and.have.lengthOf(2);
                response.body.should.all.have.keys("_id", "title", "description", "link", "tags");
                return Promise.resolve(response.body[0]._id);
            }).then(testUpdate);
    });

    it("Remove uma ferramenta usando DELETE /tools/:id", done => {
        const testDelete = (id) => {
            chai.request(server)
                .delete(`/tools/${id}`)
                .end((err, response) => {
                    if (err) return done(err);

                    response.should.have.status(200);
                    response.should.be.json.and.empty;
                    done();
                });
        };

        chai.request(server)
            .get("/tools")
            .end((err, response) => {
                if (err) return done(err);

                response.should.have.status(200);
                response.should.be.json;
                response.body
                    .should.be.an("array")
                    .and.have.lengthOf(2)
                    .and.all.have.keys("_id", "title", "description", "link", "tags");
                return Promise.resolve(response.body[0]._id);
            }).then(testDelete);
    });
});