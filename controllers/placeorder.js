const cart = require('../models/cart')
const users = require('../models/users')
const product = require('../models/product')
const checkoutuser = require('../models/shoporder')

exports.checkout= async(req,res)=>{
   
    try{
        const response = await users.findOne({ where: { status: true } });
        const user_id = response.user_id;
        const response2= await cart.findAll({ where: { user_id: user_id } });
        let totalAmount = 0;
        let product_name_list = []
        let quantity_list = []
       for(let i = 0 ; i < response2.length; i++)
       {
           let quantity = response2[i].quantity
           let temp = quantity*response2[i].price
           totalAmount = totalAmount + temp
           console.log("test is",response2[i].product_name)
           product_name_list[i]=response2[i].product_name
           quantity_list[i]=response2[i].quantity
       }            
       console.log("totalAmount is",totalAmount,"NAME",response.user_name,"proceedToPay","address",response.address,"placeorder",checkoutuser)
       const checkNameexists = await users.findOne({ where: { user_name: response.user_name } });
       if(checkNameexists){                                                                                 //modify exisisting user cart
        const response4 = await checkoutuser.findOne({ where: { user_name: checkNameexists.user_name } });      
        console.log("respone is",response4)
        response4.total_amount=totalAmount
        response4.proceedToPay=false
        await response4.save();
       }
       else{
        const response3=  checkoutuser.create({                                                 //create new row for new user
            total_amount:totalAmount,
            user_name:response.user_name,
            proceedToPay:false,
            address:response.address,
        })
       }
     
    
    const address = response.address;

  const user_name = response.user_name;
    res.json({
        message:"cart item added,do you want to proceed with payment?proceedToPay-true for proceed",
        body:{
            items:{totalAmount,user_name,address,product_name_list,quantity_list}
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

exports.checkoutPass= async(req,res)=>{
    const {proceedToPay,id} = req.body;
    console.log("proceedToPay",proceedToPay)
        try{
           if(proceedToPay == "true")
                {
                    console.log("inside",id)
                    const response = await checkoutuser.findOne({ where: { id: id } });
                    console.log("response is",response)
                    response.proceedToPay = true
                     await response.save();
                     res.json({
                  message:"Proceeding to payement gateway",
                        
                     })
           }
           else{
            res.json({
                message:"Transaction declined",
                      
                   })
           }
        }   
    catch (e) {
        console.error(e);
        res.status(500).json({
        message: "Server Error"
        });
        }
}


//all checkout items
exports.getCheckOutItems = async(req,res) =>{
    try{
        const response = await checkoutuser.findAll();
        res.status(200).json(response)
    }
    catch (e) {
        console.error(e);
        res.status(500).json({
        message: "Server Error"
        });
        }

}