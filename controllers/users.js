const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const users = require('../models/users')


//all users
exports.getUsers = async(req,res) =>{
    try{
        const response = await users.findAll();
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

//add user (admin only)
exports.createUser = async(req,res) =>{
    const {username,email,password,id} = req.body;
    console.log("name",username,"email",email)
    try{
        const response= await users.create({
            user_name:req.body.user_name,
            password:req.body.password,
            email:req.body.email,
            roles:req.body.roles,
            address:req.body.address
        })
         res.json({
             message:"user added",
             body:{
                 user:{username,email}
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
//sign up
exports.newUser = async(req,res) =>{
    const {username,email,password,id,role,address} = req.body;
    console.log("name",username,"email",email)
    try{
        const response= await users.create({
            user_name:req.body.user_name,
            password:req.body.password,
            email:req.body.email,
            roles:req.body.roles,
            address:req.body.address
        })
        // const response =await users.query('INSERT INTO users(username,email,password,role,address) VALUES ($1,$2,$3,$4,$5)',[username,email,password,role,address])
        console.log("response is",response)
         res.json({
             message:"Sign-up successful",
             body:{
                 user:{username,email}
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
//get user using ID
exports.getUserById= async(req,res)=>{
    const id = req.params.id;
    const response = await users.findOne({ where: { user_id: id } });
    console.log("response is",response)
    res.json(response)
}
//delete user
exports.deleteUser= async(req,res)=>{
    const id = req.params.id;
    const response = await users.destroy({ where: { user_id: id } });
    res.json(`User ${id} deleted successful`)
}
//sign-in
exports.verifyUser= async(req,res)=>{
    const emailbody   = req.body.email;
    const  password  = req.body.password;
    try{
        const user = await users.findOne({ where: { email: emailbody } });
        const pass_check = await users.findOne({ where: { password: password } });
        console.log("pass_check",pass_check.password)
        if(pass_check.password == password)
        {
            if (!user.user_name)                                                              //check user if exists
                return res.status(400).json({message: "User Not Exist"});
        
            if(user.roles == 'admin')                                                   //check role of user
            {
                var token = jwt.sign({ id: user.user_id }, `${process.env.JWT_SECRET}`, {
                expiresIn: 86400 // expires in 24 hours
            });
            res.json({
            message:"user signed in ,use token",
            body:{
                user:{emailbody,token}
            }
            })
            }
            else
            {
            var token = jwt.sign({ id: user.user_id }, `${process.env.JWT_SECRET2}`, {
                expiresIn: 86400 // expires in 24 hours
           });
           res.json({
            message:"user signed in ,use token",
            body:{
                user:{emailbody,token}
            }
           })
        }
    }
    }
    catch (e) {
        console.error(e);
        res.status(500).json({
        message: "Server Error"
        });
        }
}

//update user using ID
exports.updateUser= async(req,res)=>{
    const id = req.params.id;
    const {name,address} = req.body;
        try{
            const response = await users.findOne({ where: { user_id: id } });
            console.log("response is",response)
                if(name !== undefined)
                    {
                        response.user_name = name
                    }
                if(address !== undefined)
                    {
                        response.address = address
                    }
            await response.save();
            res.json({
                message:`User ${id} updated successful`,
                body:{
                    user:{name,address}
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

exports.requireSignin = expressJwt({                               //validate JWT based on role
    secret: process.env.JWT_SECRET
});