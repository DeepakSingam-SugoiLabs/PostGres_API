const Sequelize = require('sequelize');
const db = require('../config/database');

module.exports= db.define('cart_table',
{
    
    product_name:{
     type:Sequelize.STRING
    },
    product_id:{
        type: Sequelize.INTEGER,
    },
    user_id:{
        type: Sequelize.INTEGER,
    },
    price:{
        type: Sequelize.INTEGER,
    },
    quantity:{
        type: Sequelize.INTEGER,
    }
    
},{
    freezeTableName: true
})
