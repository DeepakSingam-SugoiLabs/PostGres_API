const cart = require('../models/cart')
const users = require('../models/users')
const product = require('../models/product')


//add cart
exports.addCart = async(req,res) => {
    product_id=req.body.product_id;
    quantity=req.body.quantity;
    user_id=req.body.user_id;
    try{
        console.log("cart is",cart)
        const response = await users.findOne({ where: { user_id: user_id } });
        const response2 = await product.findOne({ where: { id: product_id } });

        console.log("cart is",response.user_id)
        console.log("product_name is",response2.product_name)
        console.log("price is",response2.price)

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
                cart:{product_id,user_id,quantity}
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
