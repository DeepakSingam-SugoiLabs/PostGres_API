const Sequelize = require('sequelize');
const db = require('../config/database');

module.exports= db.define('order_details',
{
  shipping_date:{
    type: Sequelize.INTEGER,
   },
   bill_date:{
    type: Sequelize.INTEGER,
   },
  order_id:{
    type: Sequelize.INTEGER,
   },
  address:{
    type: Sequelize.STRING,
},
  phone_number:{
    type: Sequelize.INTEGER,
},
  user_id:{
    type: Sequelize.INTEGER,
   },
   total_amount:{
    type: Sequelize.INTEGER,
   },
    user_name:{
    type: Sequelize.STRING,
},
  product_id: {
    type: Sequelize.ARRAY(Sequelize.INTEGER),
},
  product_name: {
    type: Sequelize.ARRAY(Sequelize.STRING),
},
  product_price:{
    type: Sequelize.ARRAY(Sequelize.INTEGER),
},
  quantity:{
    type: Sequelize.ARRAY(Sequelize.INTEGER),
}

},{
    freezeTableName: true
})
