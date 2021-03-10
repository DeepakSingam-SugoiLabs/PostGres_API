const {Router} = require('express');
const router = Router();
const { addCart } = require('../controllers/cart')
const { requireSignin } = require('../controllers/users')

router.post('/addCart',addCart);


module.exports = router;