const {Router} = require('express');
const router = Router();
const { addProduct,getAllProducts,deleteProduct,updateProduct,getProuctById } = require('../controllers/product')
const { requireSignin } = require('../controllers/users')

router.post('/addProduct',requireSignin,addProduct);
router.get('/getAllProducts',getAllProducts);
router.delete('/deleteProduct/:id',deleteProduct);
router.put('/updateProduct/:id',updateProduct);
router.get('/productbyId/:id',getProuctById);


module.exports = router;