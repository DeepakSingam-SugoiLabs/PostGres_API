const {Router} = require('express');
const router = Router();
const { addCart,getCartItems,getCartItemById,deleteCartItem,ModifyCartItemById } = require('../controllers/cart')
const { requireSignin } = require('../controllers/users')

router.post('/addCart',addCart);
router.get('/getAllCart',getCartItems);
router.get('/getCartItemById/:id',getCartItemById);
router.delete('/deleteCartItemById/:id',deleteCartItem);
router.post('/updatequantity',ModifyCartItemById);


module.exports = router;