const {Router} = require('express');
const router = Router();
const { addProduct,getAllProducts,deleteProduct,updateProduct } = require('../controllers/product')
const { requireSignin } = require('../controllers/users')

router.post('/addProduct',requireSignin,addProduct);
router.get('/getAllProducts',getAllProducts);
router.delete('/deleteProduct/:id',deleteProduct);
router.put('/updateProduct/:id',updateProduct);


module.exports = router;