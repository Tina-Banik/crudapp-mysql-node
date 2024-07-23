const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
// database consume
const con = require("../Online_Book_Store/db/db_connection");

app.use(express.urlencoded({extended:true}));
app.use(express.json());
// consume the user route 
const userRoute = require("../Online_Book_Store/route/user.route");
app.use(process.env.API_URL, userRoute); //consume the user route
const booksRoute = require("../Online_Book_Store/route/books.route");
app.use(process.env.API_URL, booksRoute); //consume the books route
const orderRoute = require("../Online_Book_Store/route/order.route");
app.use(process.env.API_URL, orderRoute);
app.use(orderRoute);
app.use(express.static('public')); /***Let express to share server static resources */
// basic landing page
app.get('/',(req,res)=>{
    res.send("<h3>Welcome to the basic page </h3>")
})
app.listen(process.env.PORT,()=>{
    console.log(`The localhost has started at ${process.env.PORT}`)
})