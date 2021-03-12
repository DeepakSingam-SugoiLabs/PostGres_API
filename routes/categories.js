const {Router} = require('express');
const router = Router();
const { postCategory,postsubCategory,getAllCategories,categoryTree,deleteCategory,updateCategory } = require('../controllers/categories')
const { requireSignin } = require('../controllers/users')
//add category
router.post('/addcategory',postCategory);
//view all category
router.get('/allCategories',getAllCategories);
//add sub-category
router.post('/addsubcategory',postsubCategory);
//get categoryTree
router.get('/categoryTree/:id',categoryTree);
//delete category
router.delete('/deleteCategory/:id',deleteCategory);
//update category
router.put('/updateCategory/:id',updateCategory);
module.exports = router;