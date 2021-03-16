const cart = require('../models/cart')
const users = require('../models/users')
const product = require('../models/product')
const checkoutuser = require('../models/shoporder')
const order_details = require('../models/order_details')
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
        const bill_date = today
        const delivery_date = shipping_date;
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
                user_id:user_id,
                bill_date:bill_date,
                shipping_date:delivery_date
                })
            order_number++;                                                                        //generate a unique order number
             }
        const address = response.address;                                       //address and user_name of active user
        const user_name = response.user_name;
        const all_products= product_arr;   
       
        const phone_number = response.phone_number
        const zipcode = response.zipcode
        res.json({
                    message:"cart items added,do you want to proceed with payment?proceedToPay-true for proceed",
                    order_details:{
                    items:{totalAmount,user_id,user_name,phone_number,zipcode,address,order_number,all_products,bill_date,delivery_date}
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
    let product_name_list = []
    let product_price_list = []
    const response = await checkoutuser.findOne({ where: { id: id } });                 //order exists in order_details
    const user_id = response.user_id
        try{
           if(proceedToPay == "true" && response.id !== undefined)
                {
                    const response3 = await cart.findAll({ where: { user_id: user_id } });
                    for(let i=0; i < response3.length;i++)
                    {   product_id_list.push(response3[i].product_id)
                        quantity_list.push(response3[i].quantity)
                        product_name_list.push(response3[i].product_name)
                        product_price_list.push(response3[i].price)                    //store the quantity purchased by user
                    }
                    
                    let temp1,temp2;
                    for(i=0;i<product_id_list.length;i++)                                   //loop for n no.of product_ids
                    {   temp1 = product_id_list[i]
                        const response6 = await inventory.findOne({where:{product_id:temp1}})
                        const response7 = await product.findOne({where:{id:temp1}})
                        temp2 = response6.quantity - quantity_list[i]
                        let temp3 = response7.quantity - quantity_list[i]
                        inventory.update({quantity: temp2}, {where:{product_id:temp1} })    //update quantity in inventory
                        product.update({quantity: temp3}, {where:{id:temp1} })              //update quantity in product
                    }
                     const response5 = await cart.destroy({ where: { user_id: user_id } }); //remove all orders by the user
                     response.proceedToPay = true
                     const active_user = await users.findOne({where:{user_id:user_id}})
                      const create_order_detaisl = await order_details.create({
                        order_id:id,
                        user_id:active_user.user_id,
                        user_name:active_user.user_name,
                        total_amount:response.total_amount,
                        phone_number:active_user.phone_number,
                        address:active_user.address,
                        bill_date:response.bill_date,
                        shipping_date:response.shipping_date,
                        product_id:product_id_list,
                        product_name:product_name_list,
                        product_price:product_price_list,
                        quantity:quantity_list
                    })
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
//view placed order
exports.getOrderDetails= async(req,res)=>{
    try{
    const response = await order_details.findAll();
    console.log("response",response[0])
    let product_temp_list = []
    let product_temp = {
        product_id:'',
        product_name:'',
        quantity:'',
        price:''
    }
    let i;
    let product_id_list
    let quantity_list
    let product_name_list
    let product_price_list
    product_id_list = response[0].product_id
    quantity_list = response[0].quantity
    product_name_list = response[0].product_name
    product_price_list = response[0].product_price
    for(i=0;i < product_id_list.length;i++)
    {
        product_temp.product_id = product_id_list[i]
        product_temp.product_name = product_name_list[i]
        product_temp.quantity = quantity_list[i]
        product_temp.price = product_price_list[i]
        product_temp_list[i]= _.cloneDeep(product_temp)
    }
    res.json({
        user_name:response[0].user_name,
        user_id:response[0].user_id,
        address:response[0].address,
        order_number:response[0].order_id,
        total_amount:response[0].total_amount,
        bill_date:response[0].bill_date,
        shipping_date:response[0].shipping_date,
        product_details:product_temp_list,
     })
    }
    catch (e) {
        console.error(e);
        res.status(500).json({
        message: "Product not found"
        });
        }
}