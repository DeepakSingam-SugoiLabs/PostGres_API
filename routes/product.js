const {Router} = require('express');
const router = Router();
const { addProduct,getAllProducts } = require('../controllers/product')
const { requireSignin } = require('../controllers/users')

router.post('/addProduct',requireSignin,addProduct);
router.get('/getAllProducts',getAllProducts);


module.exports = router;