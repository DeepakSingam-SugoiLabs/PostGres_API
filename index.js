const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config()
const categoryRoutes = require('./routes/categories');
const productRoutes = require('./routes/product');
const cartRoutes = require('./routes/cart');

const db = require('./config/database')

  
db.authenticate().then(()=>console.log('db connected'))
                 .catch(err=>console.log(err))
//middlewares
app.use(express.json());
app.use(express.urlencoded({extended: false}));
//routes
app.use(require('./routes/index'));//user routes
app.use('/',categoryRoutes);
app.use('/',productRoutes);
app.use('/',cartRoutes);
app.listen(4000);
console.log('server on port 4000')