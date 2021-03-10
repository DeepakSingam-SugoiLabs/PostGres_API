const Sequelize = require('sequelize');
const db = require('../config/database');
module.exports =  db.define('users',
{      
        user_id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
          },
        user_name:{
         type:Sequelize.STRING
        },
        password:{
        type:Sequelize.STRING
        },
        email:{
        type:Sequelize.STRING
        },
        roles:{
        type:Sequelize.STRING
        },
        address:{
            type: Sequelize.STRING,
        },
        status:{
          type:Sequelize.BOOLEAN
         }
            });



