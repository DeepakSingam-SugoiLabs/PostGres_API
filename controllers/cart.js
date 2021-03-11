const cart = require('../models/cart')
const users = require('../models/users')
const product = require('../models/product')


//add cart
exports.addCart = async(req,res) => {
    product_id=req.body.product_id;
    quantity=req.body.quantity;
    user_id=req.body.user_id;
    try{
        const response = await users.findOne({ where: { user_id: user_id } });
        const response2 = await product.findOne({ where: { id: product_id } });
        const product_name=response2.product_name
        const user_name=response.user_name
        const price = response2.price
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
        const response = await cart.findAll();
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
    const response = await cart.findOne({ where: { id: id } });
    res.json(response)
}
//update cart quantity
exports.ModifyCartItemById= async(req,res)=>{
    console.log("hi")
    const id = req.body.id;
    quantity=req.body.quantity;
    console.log("id",id,"quantity",quantity)
    const response = await cart.findOne({ where: { id: id } });
    response.quantity = quantity
    response.save();
    res.json(response)
}
//delete cart item by id
exports.deleteCartItem= async(req,res)=>{
    const id = req.params.id;
    console.log("id is",id)
    const response1 = await cart.findOne({ where: { id: id } });
    console.log("response1",response1)
    const response = await cart.destroy({ where: { id: id } });
    res.json(`Cart ${id} deleted successful`)
}
