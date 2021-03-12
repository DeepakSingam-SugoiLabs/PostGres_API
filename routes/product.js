const {Router} = require('express');
const router = Router();
const { addProduct,getAllProducts,deleteProduct,updateProduct,getProuctById } = require('../controllers/product')
const { requireSignin } = require('../controllers/users')
//add product
router.post('/addProduct',requireSignin,addProduct);
//products list
router.get('/getAllProducts',requireSignin,getAllProducts);
//delete product by id
router.delete('/deleteProduct/:id',requireSignin,deleteProduct);
//update product by id
router.put('/updateProduct/:id',requireSignin,updateProduct);
//get single product by id
router.get('/productbyId/:id',requireSignin,getProuctById);


module.exports = router;