const {Router} = require('express');
const router = Router();
const { getUsers,createUser,getUserById,verifyUser,deleteUser,updateUser,requireSignin,newUser } = require('../controllers/users')


//get all users
router.get('/users',requireSignin,getUsers);
//get user by id
router.get('/userById/:id',requireSignin,getUserById);
//add a user
router.post('/userAdd',requireSignin,createUser);
//Sign in user
router.post('/signin',verifyUser);
//sign up user
router.post('/signup',newUser);
//update user details using ID
router.put('/userUpdate/:id',requireSignin,updateUser);
//delete user details using ID
router.delete('/userDelete/:id',requireSignin,deleteUser);

module.exports = router;