
const Sequelize = require('sequelize')
const { nameDB, local, passwordDB, hostDB, dialect, logging, timezone} = require('../user/passwords.json');

const connection = new Sequelize(nameDB, local, passwordDB, {
    hostDB,
    dialect,
    logging,
    timezone,
});

connection .authenticate()
.then(() => {
    console.log("Conectado com o banco de dados.");
}).catch((error) => {
    console.log("Erro: não foi realizada a conexão com o banco de dados.");
});

module.exports = connection;