const {Pool}= require('pg');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');

const pool = new Pool({
    host:'localhost',
    user:'postgres',
    password:'Deep@k0506',
    database:'DataBase',
    port:'5432'
})


exports.getUsers = async(req,res) =>{
    const response = await pool.query("SELECT * FROM users")
    console.log("response is ",response)

    res.status(200).json(response.rows)
}

exports.createUser = async(req,res) =>{
    const {username,email,password,id} = req.body;
    console.log("name",username,"email",email)
    try{
        const response =await pool.query('INSERT INTO users(username,email,password) VALUES ($1,$2,$3)',[username,email,password])
        console.log("response is",response)
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

exports.newUser = async(req,res) =>{
    const {username,email,password,id,role,address} = req.body;
    console.log("name",username,"email",email)
    try{
        const response =await pool.query('INSERT INTO users(username,email,password,role,address) VALUES ($1,$2,$3,$4,$5)',[username,email,password,role,address])
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

exports.getUserById= async(req,res)=>{
    const id = req.params.id;
    const response = await pool.query('SELECT * FROM users WHERE user_id = $1',[id]);
    res.json(response.rows)
}

exports.deleteUser= async(req,res)=>{
    const id = req.params.id;
    const response = await pool.query('DELETE FROM users WHERE user_id = $1',[id]);
    res.json(`User ${id} deleted successful`)
}

exports.verifyUser= async(req,res)=>{
    const email   = req.body.email;
    const  password  = req.body.password;
    try{
        console.log("email",email)
        console.log("password",password)
        let user= await pool.query('SELECT * FROM users WHERE email = $1',[email]);
        let user_id= await pool.query('SELECT user_id FROM users WHERE email = $1',[email]);
        let pass_check= await pool.query('SELECT password FROM users WHERE email = $1',[email]);
        console.log("pass_check",pass_check)
        console.log("user",user)
        console.log("user_id",user_id)
        if(pass_check.rows[0].password == password)
        {
        if (!user)
                return res.status(400).json({message: "User Not Exist"});
        let role = await pool.query('SELECT role FROM users WHERE email = $1',[email])

        console.log("role is",role.rows,email)
        if(role.rows[0].role == 'admin')
        {   console.log("inside role")
            var token = jwt.sign({ id: user_id }, `${process.env.JWT_SECRET}`, {
                expiresIn: 86400 // expires in 24 hours
           });
           res.json({
            message:"user signed in ,use token",
            body:{
                user:{email,token}
            }
           })
        }
        else{
            var token = jwt.sign({ id: user_id }, `${process.env.JWT_SECRET2}`, {
                expiresIn: 86400 // expires in 24 hours
           });
           res.json({
            message:"user signed in ,use token",
            body:{
                user:{email,token}
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


exports.deleteUser= async(req,res)=>{
    const id = req.params.id;
    const response = await pool.query('DELETE FROM users WHERE user_id = $1',[id]);
    res.json(`User ${id} deleted successful`)
}


exports.updateUser= async(req,res)=>{
    const id = req.params.id;
    const {name,email,address} = req.body;
    console.log("address is",address)
    if(address == undefined && name !== undefined && email !==undefined)
    {
    const response = await pool.query('UPDATE users SET username = $1, email = $2 WHERE user_id = $3',[name,email,id]);
    }
    else if(address !== undefined && name !== undefined && email !==undefined)
    {
     const response = await pool.query('UPDATE users SET username = $1, email = $2 ,address= $4 WHERE user_id = $3',[name,email,id,address]);

    }
    res.json(`User ${id} updated successful`)
}

exports.requireSignin = expressJwt({                               //validate JWT
    secret: process.env.JWT_SECRET
});