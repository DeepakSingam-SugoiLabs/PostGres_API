const Sequelize = require('sequelize');
const db = require('../config/database');

module.exports= db.define('sub_categories',
{
 sub_category_name:{
     type:Sequelize.STRING
 },
 sub_category_data:{
    type:Sequelize.STRING
},
parent_id:{
    type:Sequelize.INTEGER
}
}
)
