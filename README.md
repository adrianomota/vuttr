# VUTTR (Very Useful Tools to Remember)

Simples API usando node + express + mongoose + mongoDB

A API responde na porta 3000 e segue um estilo de arquitetura REST.

Há rotas para listar, filtrar, cadastrar e remover documentos MongoDB representando ferramentas, seguindo o schema:
```js
{
    id: ObjectId
    title: String
    link: String
    description: String,
    tags: [String]
}
```

Exemplo:
```json
{
    id: 1,
    title: "Notion",
    link: "<https://notion.so>",
    description: "All in one tool to organize teams and ideas. Write, plan, collaborate, and get organized. ",
    tags: [
        "organization",
        "planning",
        "collaboration",
        "writing",
        "calendar"
    ]
}
```

As rotas são as seguintes:

1. **GET** /tools *- lista todas as ferramentas cadastradas*

```json
[
    {
        id: 1,
        title: "Notion",
        link: "<https://notion.so>",
        description: "All in one tool to organize teams and ideas. Write, plan, collaborate, and get organized. ",
        tags: [
            "organization",
            "planning",
            "collaboration",
            "writing",
            "calendar"
        ]
    },
    {
        id: 2,
        title: "json-server",
        link: "<https://github.com/typicode/json-server>",
        description: "Fake REST API based on a json schema. Useful for mocking and creating APIs for front-end devs to consume in coding challenges.",
        tags: [
            "api",
            "json",
            "schema",
            "node",
            "github",
            "rest"
        ]
    },
    {
        id: 3,
        title: "fastify",
        link: "<https://www.fastify.io/>",
        description: "Extremely fast and simple, low-overhead web framework for NodeJS. Supports HTTP2.",
        tags: [
            "web",
            "framework",
            "node",
            "http2",
            "https",
            "localhost"
        ]
    }
]
```

2. **GET** /tools?tag=node *- filtra ferramentas utilizando uma busca por tag*

```json
[
    {
        id: 2,
        title: "json-server",
        link: "<https://github.com/typicode/json-server>",
        description: "Fake REST API based on a json schema. Useful for mocking and creating APIs for front-end devs to consume in coding challenges.",
        tags: [
            "api",
            "json",
            "schema",
            "node",
            "github",
            "rest"
        ]
    },
    {
        id: 3,
        title: "fastify",
        link: "<https://www.fastify.io/>",
        description: "Extremely fast and simple, low-overhead web framework for NodeJS. Supports HTTP2.",
        tags: [
            "web",
            "framework",
            "node",
            "http2",
            "https",
            "localhost"
        ]
    }
]
```

3. **POST** /tools Content-Type: application/json *- cadastra uma nova ferramenta*

O corpo da requisição deve conter as informações da ferramenta a ser cadastrada, sem o ID (gerado automaticamente pelo servidor). 

```json
{
    "title": "hotel",
    "link": "<https://github.com/typicode/hotel>",
    "description": "Local app manager. Start apps within your browser, developer tool with local .localhost domain and https out of the box.",
    "tags":["node", "organizing", "webapps", "domain", "developer", "https", "proxy"]
}
```

A resposta, em caso de sucesso, é o mesmo objeto, com seu novo ID gerado.

```json
{
    "id": 5,
    "title": "hotel",
    "link": "<https://github.com/typicode/hotel>",
    "description": "Local app manager. Start apps within your browser, developer tool with local .localhost domain and https out of the box.",
    "tags":["node", "organizing", "webapps", "domain", "developer", "https", "proxy"]
}
```

4. **DELETE** /tools/:id *- remove uma ferramenta através de seu ID*

```json
{}
```

5. **PUT** /tools/:id Content-Type: application/json *- atualiza informações de uma ferramenta*

O corpo da requisição deve conter as informações da ferramenta a ser atualizada (id é ignorado)

```json
{
    "id": 5,
    "title": "hostel",
    "link": "<https://github.com/typicode/hostel>",
}
```
A resposta, em caso de sucesso, é o mesmo objeto, com as informações atualizadas.

```json
{
    "id": 5,
    "title": "hotel",
    "link": "<https://github.com/typicode/hotel>",
    "description": "Local app manager. Start apps within your browser, developer tool with local .localhost domain and https out of the box.",
    "tags":["node", "organizing", "webapps", "domain", "developer", "https", "proxy"]
}
```