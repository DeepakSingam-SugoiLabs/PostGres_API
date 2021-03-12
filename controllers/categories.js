const categories = require('../models/categories')
var _ = require('lodash');

//add category
exports.postCategory = async(req,res) => {
let category_namee = req.body.category_name
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

console.log("inside post category_namee",sub_category_name,parent_id)
try{
    const response= await categories.create({
        name:sub_category_name,
        parent_id:parent_id
    })
    const response2= await categories.findOne({ where: { id: parent_id } })
    const category_name = response2.name
    console.log(response);
    // const response =await db.query('INSERT INTO categories(category_name,status) VALUES ($1,$2)',[category_namee,1])

      res.json({
             message:"sub-Category added",
             body:{
                 sub_category:{category_name,sub_category_name}
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
    let test=1
    const id = req.params.id;
    let counter = 0
    let counter2 = 0
    const response = await categories.findOne({ where: { id: id } });
    let rootname;
    const children = []
    const subcategory = []
    let pathlist = []
    let sub_category_name =[]
    rootname=response.name
    let path= {
        root:rootname,
        subcategory:sub_category_name,
        subchild:children

    }
    const response2 = await categories.findAll({ where: { parent_id: id } });
    for(i=0;i<response2.length;i++)
    {
        sendId=response2[i].id
        sub_category_name[i]= response2[i].name
         children[i]=await bringrootvalue(sendId)
         path.subcategory= sub_category_name[i]
         path.subchild=children[i]
         console.log("sub-child",children[i])
         console.log(" path isssss",path)
          pathlist[i] = _.cloneDeep(path);


        // pathlist[counter2]=path
        //     console.log("pathlist[i]",pathlist[counter2])
        //     counter2++;


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
        console.log("subname",subname)
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


    // do{
    // const response2 = await categories.findAll({ where: { parent_id: id } });
    // console.log("response2",response2.length)
    //    for(let i = 0 ; i < response2.length;i++)
    //    {
    //     let sub_category = response2[i].id
    //     const response3 = await categories.findAll({ where: { parent_id: id } });
        
    //    }
    // }while(test !==0)
