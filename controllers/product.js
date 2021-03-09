const product = require('../models/product')

//add products
exports.addProduct = async(req,res) => {
    product_name=req.body.product_name;
    seller_details=req.body.seller_details;
    specifications=req.body.specifications;
    try{
        const response= await product.create({
            product_name:req.body.product_name,
            price:req.body.price,
            specifications:req.body.specifications,
            seller_details:req.body.seller_details,
            comments_posted:req.body.comments_posted,
            quantity:req.body.quantity,
            sub_category_id:req.body.sub_category_id,
        })

        res.json({
            message:"Product added",
            body:{
                product:{product_name,specifications,seller_details}
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
