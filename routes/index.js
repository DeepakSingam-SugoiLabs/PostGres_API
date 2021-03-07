const {Router} = require('express');
const router = Router();
const { getUsers,createUser,getUserById,verifyUser,deleteUser,updateUser,requireSignin,newUser } = require('../controllers/users')

router.get('/users',requireSignin,getUsers);
router.get('/userById/:id',requireSignin,getUserById);
router.post('/userAdd',requireSignin,createUser);
router.post('/signin',verifyUser);
router.post('/signup',newUser);
router.put('/userUpdate/:id',requireSignin,updateUser);
router.delete('/userDelete/:id',requireSignin,deleteUser);

module.exports = router;