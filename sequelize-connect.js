const {Sequelize} = require('sequelize');

const connection = new Sequelize('database', 'username', 'password', {
    dialect: 'sqlite',
    storage: './restaurants-seq.sqlite'
});

module.exports=connection;