const jsonServer = require('json-server');
const path = require('path');

const { addSweeperApi } = require('./sweeperApi');

const server = jsonServer.create();

const db = 'db-local.json';

const router = jsonServer.router(`data/${db}`);

const middlewares = jsonServer.defaults({
    static: path.join(__dirname, "build"),
});

server.use(middlewares);

server.use(jsonServer.bodyParser);

addSweeperApi(server, router);

server.use(router);
let port = process.env.PORT || 8000;
server.listen(port, () => {
    console.log(`Counterfactual Server is running on port ${port}`);
});