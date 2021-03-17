const categories = require('../models/categories')
var _ = require('lodash');
//add category
exports.postCategory = async(req,res) => {
try{
  const response= await categories.create({                                     //create category
        name:req.body.category_name,
        parent_id:0
    })
      res.json({
             message:"Category added",
             body:{
                 user:req.body.category_name
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
//view all categories
exports.getAllCategories = async(req,res) =>{
    try{
        const response = await categories.findAll();                        //view all categories
        console.log("response is",response)
        res.status(200).json(response)
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
let parent_id = req.body.parent_id
try{
    const response= await categories.create({                               //create a sub-category
        name:sub_category_name,
        parent_id:parent_id
    })
    const response2= await categories.findOne({ where: { id: parent_id } }) //parent category name
    const parent_name = response2.name
      res.json({
             message:"sub-Category added",
             body:{
                 sub_category:{parent_name,sub_category_name}
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
//getcategoryTree
exports.categoryTree= async(req,res)=>{    
    const id = req.params.id;
    const response = await categories.findOne({ where: { id: id } });               //root_id
    let rootname;
    const children = []
    let pathlist = []
    let sub_category_name =[]
    rootname=response.name
    let path= {
        root:rootname,
        subcategory:sub_category_name,
        subchild:children

    }
    const response2 = await categories.findAll({ where: { parent_id: id } });
    for(i=0;i<response2.length;i++)                                 //recursive for sub-category
    {
          sendId=response2[i].id
          sub_category_name[i]= response2[i].name
          children[i]=await bringrootvalue(sendId)                  //return child category of a sub category
          path.subcategory= sub_category_name[i]                    
          path.subchild=children[i]
          pathlist[i] = _.cloneDeep(path);
    }
    res.json(pathlist)
}
//return child elements of a category
async function bringrootvalue(id) {
    let subname = []
    const response3 = await categories.findAll({ where: { parent_id: id } });
        if(response3.length>0)
        {
            for(let i = 0 ; i < response3.length;i++)
            {
                subname[i]= response3[i].name
            }
        }
        return subname
  }
//delete Category
exports.deleteCategory= async(req,res)=>{
    const id = req.params.id;
    const response = await categories.destroy({ where: { id: id } });
    res.json(`Category ${id} deleted successful`)
}
//update parent_id or category_name
exports.updateCategory= async(req,res)=>{
    const id = req.params.id;
    const {parent_id,name} = req.body;
        try{
            const response = await categories.findOne({ where: { id: id } });           //update for this id
                if(name !== undefined)
                    {
                        response.name = name
                    }
                if(parent_id !== undefined)
                    {
                        response.parent_id = parent_id
                    }
            await response.save();
            res.json({
                message:`Category ${id} updated successful`,
                body:{
                    user:{name,parent_id}
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

