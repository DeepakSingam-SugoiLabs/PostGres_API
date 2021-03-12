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
            quantity:req.body.quantity
            
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
//all cart items
exports.getAllProducts = async(req,res) =>{
    try{
        const response = await product.findAll();
        res.status(200).json(response)
    }
    catch (e) {
        console.error(e);
        res.status(500).json({
        message: "Server Error"
        });
        }

}
//delete product
exports.deleteProduct= async(req,res)=>{
    const id = req.params.id;
    const response = await product.destroy({ where: { id: id } });
    res.json(`Product ${id} deleted successful`)
}

//update product data
exports.updateProduct= async(req,res)=>{
    const id = req.params.id;
    const {specifications,seller_details,price,quantity,comments_posted} = req.body;
        try{
            const response = await product.findOne({ where: { id: id } });
            console.log("response is",response)
                if(specifications !== undefined)
                    {
                        response.specifications = specifications
                    }
                if(seller_details !== undefined)
                    {
                        response.seller_details = seller_details
                    }
                if(price !== undefined)
                    {
                        response.price = price
                    }
                if(quantity !== undefined)
                    {
                        response.quantity = quantity
                    }        
                    if(comments_posted !== undefined)
                    {
                        response.comments_posted = comments_posted
                    }    
            await response.save();
            res.json({
                message:`Product ${id} updated successful`,
                body:{
                    user:{specifications,seller_details,price,quantity,comments_posted}
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

