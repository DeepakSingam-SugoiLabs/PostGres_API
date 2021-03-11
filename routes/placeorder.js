const {Router} = require('express');
const router = Router();
const { checkout,checkoutPass,getCheckOutItems } = require('../controllers/placeorder')
const { requireSignin } = require('../controllers/users')


router.get('/checkout',checkout);
router.put('/checkoutPass',checkoutPass);
router.get('/allCheckoutitems',getCheckOutItems);


module.exports = router;