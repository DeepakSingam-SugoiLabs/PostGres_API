const {Router} = require('express');
const router = Router();
const { addProduct,getAllProducts,deleteProduct,updateProduct,getProuctById,getProuctByCategoryID,uploadImage} = require('../controllers/product')
const { requireSignin } = require('../controllers/users')
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function(req, file, callback) {
    callback(null, '/src/my-images');
  },
  filename: function (req, file, callback) {
    callback(null, file.fieldname);
  }
});


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
//get product by id
router.get('/getProuctByCategoryID/:id',getProuctByCategoryID);
//upload Image
router.post('/uploadImage',uploadImage)
module.exports = router;