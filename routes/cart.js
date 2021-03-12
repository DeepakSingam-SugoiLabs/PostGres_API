const {Router} = require('express');
const router = Router();
const { addCart,getCartItems,getCartItemById,deleteCartItem,ModifyCartItemById } = require('../controllers/cart')
const { requireSignin } = require('../controllers/users')
//add item to cart
router.post('/addCart',requireSignin,addCart);
//cart list
router.get('/getAllCart',requireSignin,getCartItems);
//get single cart-item by id
router.get('/getCartItemById/:id',requireSignin,getCartItemById);
//delete cart-item by id
router.delete('/deleteCartItemById/:id',requireSignin,deleteCartItem);
//update cart-item by id
router.post('/updatequantity',requireSignin,ModifyCartItemById);


module.exports = router;