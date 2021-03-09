const {Router} = require('express');
const router = Router();
const { addProduct } = require('../controllers/product')
const { requireSignin } = require('../controllers/users')

router.post('/addProduct',requireSignin,addProduct);


module.exports = router;