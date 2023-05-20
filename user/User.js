const Sequelize = require("sequelize");
const connection = require("../databases/database.js");


const User = connection.define('users', {
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    resetPasswordToken: {
        type: Sequelize.STRING,
        allowNull: true
    },
    resetPasswordExpires: {
        type: Sequelize.DATE,
        allowNull: true
    },
    userconfirmToken: {
        type: Sequelize.STRING,
        allowNull: true
    },
    userconfirmExpires: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: null
    },
    isadmin: { 
        type: Sequelize.STRING, 
        default: false,
    }
})

User.sync({ force: false })
    .then(() => {
        console.log("Tabela 'users' sincronizada com o banco de dados");
    })
    .catch((error) => {
        console.error("Erro ao sincronizar tabela 'users' com o banco de dados:", error);
    });

module.exports = User;