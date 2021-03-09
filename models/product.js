const Sequelize = require('sequelize');
const db = require('../config/database');

module.exports= db.define('products',
{
    
    product_name:{
     type:Sequelize.STRING
    },
    specifications:{
    type:Sequelize.STRING
    },
    seller_details:{
    type:Sequelize.STRING
    },
    comments_posted:{
    type:Sequelize.STRING
    },
    price:{
        type: Sequelize.INTEGER,
    },
    quantity:{
        type: Sequelize.INTEGER,
    },
    sub_category_id:{
        type: Sequelize.INTEGER,
    }
})