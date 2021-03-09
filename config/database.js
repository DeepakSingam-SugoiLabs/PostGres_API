const Sequelize = require('sequelize');

module.exports= new Sequelize('DataBase','postgres','Deep@k0506',{
    host:'localhost',
    dialect:'postgres',
    user:'postgres',
    password:'Deep@k0506',
    database:'DataBase',
    port:'5432'
});
//test db
