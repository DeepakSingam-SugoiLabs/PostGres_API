const categories = require('../models/categories')
var _ = require('lodash');

//add category
exports.postCategory = async(req,res) => {
try{
  const response= await categories.create({
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
        const response = await categories.findAll();
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
    const response= await categories.create({
        name:sub_category_name,
        parent_id:parent_id
    })
    const response2= await categories.findOne({ where: { id: parent_id } }) //parent category name
    const parent_name = response2.name
    console.log(response);
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
    const response = await categories.findOne({ where: { id: id } });
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
          console.log("child",response2[i].name)
          console.log("sub-child",children[i])
          console.log(" path isssss",path)
          pathlist[i] = _.cloneDeep(path);
    }
    console.log("children",children)
    console.log("rootname",rootname)
    console.log("pathlist001",pathlist)

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
                console.log("response3[i].name",response3[i].name)
            }
        }
        console.log("subname to return",subname)
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
            const response = await categories.findOne({ where: { id: id } });
            console.log("response is",response)
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

