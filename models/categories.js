const Sequelize = require('sequelize');
const db = require('../config/database');

module.exports= db.define('categories',
{
     category_name:{
     type:Sequelize.STRING
     },
     category_id: {
     allowNull: false,
     autoIncrement: true,
     primaryKey: true,
     type: Sequelize.INTEGER,
     },
     status:{
     type:Sequelize.BOOLEAN
    }
}
)
