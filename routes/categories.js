const {Router} = require('express');
const router = Router();
const { postCategory,postsubCategory } = require('../controllers/categories')
const { requireSignin } = require('../controllers/users')

router.post('/addcategory',requireSignin,postCategory);

router.post('/addsubcategory',requireSignin,postsubCategory);

module.exports = router;