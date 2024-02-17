//IMPORT FROM PACKAGES
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();



//IMPORT FROM OTHER FILES
const authRouter = require('./routes/auth');
const adminRouter = require('./routes/admin');
const productRouter = require('./routes/product');

//INIT
const PORT = 3000;
const app = express();
const db = process.env.MONGODB_URL;

//middleware
app.use(express.json());
app.use(authRouter);
app.use(adminRouter);
app.use(productRouter);

//Connections
mongoose.connect(db).then(() =>{
    console.log('Connection Successful');
}).catch((e)=>{
    console.log(e);
});


app.listen(PORT,"0.0.0.0",()=> {
    console.log(`Connected at port ${PORT}`);
});
