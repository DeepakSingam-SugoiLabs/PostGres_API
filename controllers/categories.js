const subcategories = require('../models/subcategories')
const categories = require('../models/categories')
//add category
exports.postCategory = async(req,res) => {
let category_namee = req.body.category_name
try{
    categories.findOne({ where: {status: true} }).then(function(project) {
        console.log("inside query",project)
        const changestatus= project.update({
            status:false
        })      
    })
  const response= await categories.create({
        category_name:req.body.category_name,
        status:1
    })

      res.json({
             message:"Category added",
             body:{
                 user:{category_namee}
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
//add sub_category
exports.postsubCategory = async(req,res) => {   
let sub_category_name = req.body.sub_category_name
let sub_category_data = req.body.sub_category_data
let parent_id = req.body.parent_id

console.log("inside post category_namee",sub_category_name,sub_category_data)
try{
  const response= await subcategories.create({
    sub_category_name:sub_category_name,
    sub_category_data:sub_category_data,
    parent_id:parent_id
    })
    console.log(response);
    // const response =await db.query('INSERT INTO categories(category_name,status) VALUES ($1,$2)',[category_namee,1])

      res.json({
             message:"sub-Category added",
             body:{
                 sub_category:{sub_category_name,sub_category_data}
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