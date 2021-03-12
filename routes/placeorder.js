const {Router} = require('express');
const router = Router();
const { checkout,checkoutPass,getCheckOutItems } = require('../controllers/shoporder')
const { requireSignin } = require('../controllers/users')

//items of user_cart proceeded to checout
router.get('/checkout',checkout);
//proceed to pay
router.put('/checkoutPass',checkoutPass);
//list of all user and their cart
router.get('/allCheckoutitems',getCheckOutItems);


module.exports = router;