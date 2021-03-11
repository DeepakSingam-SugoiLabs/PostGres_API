const {Router} = require('express');
const router = Router();
const { checkout } = require('../controllers/placeorder')
const { requireSignin } = require('../controllers/users')


router.get('/checkout',checkout);


module.exports = router;