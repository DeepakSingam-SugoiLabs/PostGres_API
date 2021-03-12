const Sequelize = require('sequelize');
const db = require('../config/database');

module.exports= db.define('category_products',
{
    name:{
        type:Sequelize.STRING,
        allowNull: false
       },
       parent_id:{
           type: Sequelize.INTEGER,
       }
}
)
