const cart = require('../models/cart')
const users = require('../models/users')
const product = require('../models/product')
const checkoutuser = require('../models/shoporder')
var _ = require('lodash');

//checkout for all selected items from cart
exports.checkout= async(req,res)=>{
    try{
        const response = await users.findOne({ where: { status: true } });          //user which is active
        const user_id = response.user_id;
        const response2= await cart.findAll({ where: { user_id: user_id } });
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
        var dd = today.getDate();
        dd= dd+3
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

        //    console.log("test is",response2[i].product_name)
        //    product_name_list[i]=response2[i].product_name
        //    quantity_list[i]=response2[i].quantity
       }            
    //    console.log("totalAmount is",totalAmount,"NAME",response.user_name,"proceedToPay","address",response.address,"placeorder",checkoutuser)
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
        order_number++;
       }
    const address = response.address;                                       //address and user_name of active user
    const user_name = response.user_name;
    const all_products= product_arr;   
    const delivery_date = today;
    const proceedToPay = checkNameexists.proceedToPay
    const phone_number = response.phone_number
    const zipcode = response.zipcode
    console.log("response is ",response)
    console.log("zip code",zipcode,"ph_no",phone_number)
    res.json({
        message:"cart items added,do you want to proceed with payment?proceedToPay-true for proceed",
        order_details:{
            items:{totalAmount,user_id,user_name,phone_number,zipcode,address,order_number,all_products,delivery_date,proceedToPay}
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
//Confirm the checkout list
exports.checkoutPass= async(req,res)=>{
    const {proceedToPay,id} = req.body;
    const response = await checkoutuser.findOne({ where: { id: id } });
    console.log("proceedToPay",proceedToPay)
    console.log("response is",response.user_id)
   const user_id = response.user_id
        try{
           if(proceedToPay == "true" && response.id !== undefined)
                {
                    const response3 = await cart.destroy({ where: { user_id: user_id } });
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