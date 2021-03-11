const cart = require('../models/cart')
const users = require('../models/users')
const product = require('../models/product')
const checkoutuser = require('../models/shoporder')

exports.checkout= async(req,res)=>{
   
    try{
        const response = await users.findOne({ where: { status: true } });
  
        const user_id = response.user_id;
        const response2= await cart.findAll({ where: { user_id: user_id } });
   
       //  console.log("reponse is",response,user_id)
        let totalAmount = 0;
        let product_name_list = []
       for(let i = 0 ; i < response2.length; i++)
       {
           let quantity = response2[i].quantity
           let temp = quantity*response2[i].price
           
           totalAmount = totalAmount + temp
           console.log("test is",response2[i].product_name)
           product_name_list[i]=response2[i].product_name
       }
       console.log("totalAmount is",totalAmount,"NAME",response.user_name,"proceedToPay","address",response.address,"placeorder",checkoutuser)
       console.log('product_name_list',product_name_list)
       const response3=  checkoutuser.create({
        total_amount:totalAmount,
        user_name:response.user_name,
        proceedToPay:false,
        address:response.address,
    })
    
    const address = response.address;

  const user_name = response.user_name;
    res.json({
        message:"cart item added,do you want to proceed with payment?",
        body:{
            items:{totalAmount,user_name,address,product_name_list}
        }
    })
    }
    
    catch (e) {
        console.error(e);
        res.status(500).json({
        message: "Server Error"
        });
        }
}