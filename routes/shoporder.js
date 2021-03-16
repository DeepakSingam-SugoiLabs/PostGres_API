const {Router} = require('express');
const router = Router();
const { checkout,checkoutPass,getCheckOutItems,getOrderDetails } = require('../controllers/shoporder')
const { requireSignin } = require('../controllers/users')

//items of user_cart proceeded to checout
router.get('/checkout',requireSignin,checkout);
//proceed to pay
router.put('/checkoutPass',requireSignin,checkoutPass);
//list of all user and their cart
router.get('/allCheckoutitems',requireSignin,getCheckOutItems);

router.get('/getOrderDetails',getOrderDetails);

module.exports = router;