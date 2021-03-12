const {Router} = require('express');
const router = Router();
const { postCategory,postsubCategory,getAllCategories,categoryTree,deleteCategory,updateCategory } = require('../controllers/categories')
const { requireSignin } = require('../controllers/users')
//add category
router.post('/addcategory',requireSignin,postCategory);
//view all category
router.get('/allCategories',requireSignin,getAllCategories);
//add sub-category
router.post('/addsubcategory',requireSignin,postsubCategory);
//get categoryTree
router.get('/categoryTree/:id',requireSignin,categoryTree);
//delete category
router.delete('/deleteCategory/:id',requireSignin,deleteCategory);
//update category
router.put('/updateCategory/:id',requireSignin,updateCategory);
module.exports = router;