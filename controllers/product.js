const product = require('../models/product')
const categories = require('../models/categories')
var _ = require('lodash');
const { Op } = require('sequelize');
const sequelize = require('sequelize');
const inventory = require('../models/inventory')
const formiable = require('formidable')
const fs = require('fs')
const path = require('path') 

//add products
exports.addProduct = async(req,res) => {
    product_name=req.body.product_name;
    seller_details=req.body.seller_details;
    specifications=req.body.specifications;
    category_id=req.body.category_id;
    try{
        let temp = 0 
        let temp_category_id = category_id
        let categorylist = []
        while(temp == 0)                                                        
        {  
            if(temp_category_id!==0)
            {
            const response2= await categories.findAll({where:{ id:temp_category_id}})  //find the category
            categorylist.push(response2[0].id)                                         //list of id of category and sub-category of a product
            temp_category_id = response2[0].parent_id                                 //link to it's parent
            if(temp_category_id ==0)
            temp++;
            }
            
        }
        const response= await product.create({                                          //create product
            product_name:req.body.product_name,
            price:req.body.price,
            specifications:req.body.specifications,
            seller_details:req.body.seller_details,
            comments_posted:req.body.comments_posted,
            quantity:req.body.quantity,
            category_id:req.body.category_id,
            category_list:categorylist
        })
        let product_id = response.id;
        const response2= await inventory.create({
            product_name:req.body.product_name,
            price:req.body.price,
            product_id:product_id,
            quantity:req.body.quantity            
        })
        res.json({
            message:"Product added",
            body:{
                product:{product_name,specifications,seller_details,categorylist}
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
    const response2 = await inventory.destroy({ where: { product_id: id } });

    res.json(`Product ${id} deleted successful`)
}
//update product data
exports.updateProduct= async(req,res)=>{
    const id = req.params.id;
    const {specifications,seller_details,price,quantity,comments_posted,category_id,product_image} = req.body;
        try{
            const response = await product.findOne({ where: { id: id } });
            const response2 = await inventory.findOne({ where: { product_id: id } });

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
                        response2.price = price
                    }
                if(quantity !== undefined)
                    {
                        response.quantity = quantity
                        response2.quantity = quantity
                    }        
                    if(comments_posted !== undefined)
                    {
                        response.comments_posted = comments_posted
                    }
                    if(category_id !== undefined)
                    {
                        product.update(
                            {'category_list': sequelize.fn('array_append', sequelize.col('category_list'), category_id)},
                            {'where': {'id': id}}
                           );                    
                    }    
            await response.save();
            res.json({
                message:`Product ${id} updated successful`,
                body:{
                    user:{specifications,seller_details,price,quantity,comments_posted,category_id}
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
//get product using ID
exports.getProuctById= async(req,res)=>{
    try{
    const id = req.params.id;
    const response = await product.findOne({ where: { id: id } });
    res.json(response)
    }
    catch (e) {
        console.error(e);
        res.status(500).json({
        message: "Product not found"
        });
        }
}
//get products using Category_ID
exports.getProuctByCategoryID= async(req,res)=>{
    const id = req.params.id;
    try{
    const response = await product.findAll({ where: 
        {		
            category_list: { [Op.contains]: [id] }	
        }
    });
    res.json(response)
    }
    catch (e) {
        console.error(e);
        res.status(500).json({
        message: "Product by category not found"
        });
        }
}

exports.uploadImage = async(req,res,next) =>
{
    let form = new formiable.IncomingForm();
    form.keepExtensions = true
    form.parse(req, async(err,fields,files)=>{
            if(err)
            {
                return res.status(400).json({
                    error:"Image could not be uploaded"
                })
            }
            
            let post = new product(fields)
            console.log("fields are",fields,"req.profile",post)
            if(files.product_image && fields.id){
                post.product_image = fs.readFileSync(files.product_image.path)

                post.product_image.contentType = files.product_image.type

                post.product_image.name = files.product_image.name

                let oldPath = files.product_image.path;
                console.log("oldPatproduct_image",oldPath)

                var newPath = path.join(__dirname, '../uploads') 
                + '/'+files.product_image.name 
                console.log("newPath",newPath)

                var rawData = fs.readFileSync(oldPath) 
                fs.writeFile(newPath, rawData, function(err){ 
                    if(err) console.log(err) 
                    return ""
                }) 
                console.log("picture is",files.product_image.name)
            }
            else{
                return res.status(400).json({
                    error:"Image could not be uploaded"
                })
            }
            console.log("post.product_image",post.product_image)
            let response = await product.findOne({where: {id:fields.id}})
            response.product_image= files.product_image.name
            response.save()
            res.json(response)

        })
}
