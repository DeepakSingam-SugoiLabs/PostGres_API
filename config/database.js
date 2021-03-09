const Sequelize = require('sequelize');

module.exports= new Sequelize('DataBase','postgres','Deep@k0506',{
    host:'localhost',
    dialect:'postgres',
    port:'5432'
});
//test db
