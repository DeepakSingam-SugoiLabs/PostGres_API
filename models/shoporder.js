const Sequelize = require('sequelize');
const db = require('../config/database');

module.exports= db.define('shopOrders',
{
    
    address:{
        type:Sequelize.STRING
       },
       total_amount:{
           type: Sequelize.INTEGER,
       },
       user_name:{
           type: Sequelize.STRING,
       },
       proceedToPay:{
           type: Sequelize.BOOLEAN,
       },
       order_number:{
        type: Sequelize.INTEGER,
       },
       user_id:{
        type: Sequelize.INTEGER,
       }
})
