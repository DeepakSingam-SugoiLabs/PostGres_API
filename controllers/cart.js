const cart = require('../models/cart')
const users = require('../models/users')
const product = require('../models/product')
const inventory = require('../models/inventory')

//add cart
exports.addCart = async(req,res) => {
    product_id=req.body.product_id;
    quantity=req.body.quantity;
    try{
        const response = await users.findOne({ where: { status: true } });                      //get user details
        const response2 = await product.findOne({ where: { id: product_id } });                 //get product details
        const response3 = await inventory.findOne({where:{product_id:product_id}})              //inventory check
        if(response3.quantity >= quantity)                                                      //as long as sufficient inventory quantity
       {
        const product_name=response2.product_name
        const user_name=response.user_name
        const price = response2.price
        let user_id = response.user_id
        const response3= await cart.create({
            product_id:req.body.product_id,
            product_name:response2.product_name,
            price:response2.price,
            quantity:req.body.quantity,
            user_id:user_id
        })

        res.json({
            message:"cart item added",
            body:{
                cart:{user_id,user_name,product_id,product_name,quantity,price}
            }
        })
    }
    else
    {
        res.status(400).json({
            message:"please order lesser quantity"
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
//all cart items
exports.getCartItems = async(req,res) =>{
    try{
        const response = await cart.findAll();                                              //all cart items
        res.status(200).json(response)
    }
    catch (e) {
        console.error(e);
        res.status(500).json({
        message: "Server Error"
        });
        }

}
//get cart item by id
exports.getCartItemById= async(req,res)=>{
    const id = req.params.id;
    const response = await cart.findOne({ where: { id: id } });                             //get cart item for an id
    res.json(response)
}
//update cart quantity
exports.ModifyCartItemById= async(req,res)=>{
    const id = req.body.id;
    quantity=req.body.quantity;
    console.log("id",id,"quantity",quantity)
    try{
    const response = await cart.findOne({ where: { id: id } });                         //get cart item for an id
    const product_id = response.product_id
    const response3 = await inventory.findOne({where:{product_id:product_id}})          //update inventory
    if(response3.quantity >= quantity)
    {
    response.quantity = quantity
    response.save();
    res.json(response)
    }
    else{
        res.status(500).json({
            message: "Decrease the quantity"
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
//delete cart item by id
exports.deleteCartItem= async(req,res)=>{
    const id = req.params.id;
    try
    {
        const response = await cart.destroy({ where: { id: id } });                           //remove cart item
        res.json(`Cart ${id} deleted successful`)
    }
    catch (e) {
        console.error(e);
        res.status(500).json({
        message: "Server Error"
        });
        }
}
