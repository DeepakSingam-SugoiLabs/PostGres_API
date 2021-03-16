const cart = require('../models/cart')
const users = require('../models/users')
const product = require('../models/product')
const checkoutuser = require('../models/shoporder')
var _ = require('lodash');
const inventory = require('../models/inventory');

//checkout for all selected items from cart
exports.checkout= async(req,res)=>{
    try{
        const response = await users.findOne({ where: { status: true } });          //user which is active
        const user_id = response.user_id;
        const response2= await cart.findAll({ where: { user_id: user_id } });
        console.log("response2",response2.length)
        if(response2.length>0)
        {
        let totalAmount = 0;
        let product_name_list = []
        let quantity_list = []
        let order_number = 1000
        let product_list= {
            product_id:'',
            product_name:'',
            price:'',
            quantity:''
    
        }
        var today = new Date();
        var shipping_date = new Date();
        var dd = today.getDate();
        dd2= dd+3
        var mm = today.getMonth()+1; 
        var yyyy = today.getFullYear();
        if(dd<10) 
        {
            dd='0'+dd;
        } 
        
        if(mm<10) 
        {
            mm='0'+mm;
        } 
        today = dd+'-'+mm+'-'+yyyy;
        shipping_date = dd2+'-'+mm+'-'+yyyy;
        let product_arr = [];
        for(let i = 0 ; i < response2.length; i++)                                   //compute total amount,quantity list,product_name_list
        {
                 let quantity = response2[i].quantity
                 let temp = quantity*response2[i].price
                 totalAmount = totalAmount + temp
                 product_list.product_id= response2[i].product_id               
                 product_list.product_name=response2[i].product_name
                 product_list.price= response2[i].price                 
                 product_list.quantity=response2[i].quantity
                 product_arr[i] = _.cloneDeep(product_list);
        }            
       const checkNameexists = await checkoutuser.findOne({ where: { user_name: response.user_name } });
       if(checkNameexists !== null){                                                                                 //modify exisisting user cart
        const response4 = await checkoutuser.findOne({ where: { user_name: checkNameexists.user_name } });      
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
                order_number:order_number,
                user_id:user_id
                })
            order_number++;                                                                        //generate a unique order number
             }
        const address = response.address;                                       //address and user_name of active user
        const user_name = response.user_name;
        const all_products= product_arr;   
        const bill_date = today
        const delivery_date = shipping_date;
        const proceedToPay = checkNameexists.proceedToPay
        const phone_number = response.phone_number
        const zipcode = response.zipcode
        res.json({
                    message:"cart items added,do you want to proceed with payment?proceedToPay-true for proceed",
                    order_details:{
                    items:{totalAmount,user_id,user_name,phone_number,zipcode,address,order_number,all_products,bill_date,delivery_date,proceedToPay}
                 }
            })
      }
      else{
        res.status(400).json({
            message: "Add items to cart"
            });
      }
     }
      catch (e) {
        console.error(e);
        res.status(500).json({
        message: "Server Error"
        });
        }
}
//Confirm the checkout list
exports.checkoutPass= async(req,res)=>
{
    const {proceedToPay,id} = req.body;                                             
    let product_id_list =[]
    let quantity_list=[]
    const response = await checkoutuser.findOne({ where: { id: id } });                 //order exists in order_details
    const user_id = response.user_id
        try{
           if(proceedToPay == "true" && response.id !== undefined)
                {
                    const response3 = await cart.findAll({ where: { user_id: user_id } });
                    for(let i=0; i < response3.length;i++)
                    {
                        product_id_list[i] = response3[i].product_id                //store all the product_ids
                        quantity_list[i] = response3[i].quantity                    //store the quantity purchased by user
                    }
                    let temp1,temp2;
                    for(i=0;i<product_id_list.length;i++)                                   //loop for n no.of product_ids
                    {   temp1 = product_id_list[i]
                        const response6 = await inventory.findOne({where:{product_id:temp1}})
                        const response7 = await product.findOne({where:{id:temp1}})
                        temp2 = response6.quantity - quantity_list[i]
                        let temp3 = response7.quantity - quantity_list[i]
                        inventory.update({quantity: temp2}, {where:{product_id:temp1} })    //update quantity in inventory
                        product.update({quantity: temp3}, {where:{id:temp1} })              //update product in inventory
                    }
                     const response5 = await cart.destroy({ where: { user_id: user_id } }); //remove all orders by the user
                     response.proceedToPay = true
                     await response.save();
                     const response2 = await 
                     res.json({
                               message:"Proceeding to payement gateway"
                     })
           }
           else{
            res.json({
                message:"Transaction declined"
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