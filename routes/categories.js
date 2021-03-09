const {Router} = require('express');
const router = Router();
const { postCategory,postsubCategory } = require('../controllers/categories')
const { requireSignin } = require('../controllers/users')
//add category
router.post('/addcategory',requireSignin,postCategory);
//add sub-category
router.post('/addsubcategory',requireSignin,postsubCategory);

module.exports = router;