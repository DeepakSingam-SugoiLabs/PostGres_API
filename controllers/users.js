const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const users = require('../models/users')
const bcrypt = require('bcrypt');
//all users
exports.getUsers = async(req,res) =>{
    try{
        const response = await users.findAll();
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
    const {username,email} = req.body;
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
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);                       //encryt password
    try{
        const response= await users.create({                                        //create user
            user_name:req.body.user_name,
            password:hashedPassword,
            email:req.body.email,
            roles:req.body.roles,
            address:req.body.address,
            status:false
        })
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
    res.json(response)
}
//delete user
exports.deleteUser= async(req,res)=>{
    const id = req.params.id;
    const response = await users.destroy({ where: { user_id: id } });
    res.json(`User ${id} deleted successful`)
}
//sign in
exports.verifyUser= async(req,res)=>{
    const emailbody   = req.body.email;
    const  password  = req.body.password;
    try{
        const user = await users.findOne({ where: { email: emailbody } });
        const isMatch = await bcrypt.compare(password, user.password);//ENCRYT password
        users.findOne({ where: {status: true} }).then(function(project) {
            const changestatus= project.update({
                status:false
            })      
        })        
        if(isMatch)                                                                            //checks if password match
        {
            if (!user.user_name)                                                              //check user if exists
                return res.status(400).json({message: "User Not Exist"});
        
            if(user.roles == 'admin')                                                   //check role of user
            {
                var token = jwt.sign({ id: user.user_id }, `${process.env.JWT_SECRET}`, {
                expiresIn: 86400 // expires in 24 hours
            });
            const changestatus= user.update({
                status:true
            })      
            res.json({
            message:"user signed in ,use token",
            body:{
                user:{emailbody,token}
            }
            })
            }
            else                                                                            //jwt for no-admin
            {
                  var token = jwt.sign({ id: user.user_id }, `${process.env.JWT_SECRET2}`, {
                expiresIn: 86400 // expires in 24 hours
                    });
                    const changestatus= user.update({
                        status:true
                    })
                  res.json({
                  message:"user signed in ,use token",
                            body:{
                                    user:{emailbody,token}
                                 }
                          })
            }   
    }
    else{                                                                   //password does not match
         res.status(401).json({
        message: "Incorrect-password"
        });
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
            const response = await users.findOne({ where: { user_id: id } });           //find user by id
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
//validate sign in
exports.requireSignin = expressJwt({                               //validate JWT based on role
    secret: process.env.JWT_SECRET
});