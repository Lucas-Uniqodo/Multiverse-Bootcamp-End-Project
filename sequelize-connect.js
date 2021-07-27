const {Sequelize} = require('sequelize');

const connection = new Sequelize('database', 'username', 'password', {
    dialect: 'sqlite',
    storage: './omniverse.sqlite'
});

module.exports=connection;