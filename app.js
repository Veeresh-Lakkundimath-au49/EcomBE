let express=require('express');
let app=express()
let {home,detail,searchedItem,signup,detailInfo,login,price,googlelogin,logout}=require("./components/components")


//setting up CORS to avoid error
const cors=require('cors')
app.use(cors())

app.use(cors({
    origin: 'https://preeminent-gelato-c05b21.netlify.app',
    credentials: true
  }));

let jwt = require('jsonwebtoken')


//Cookie parser to get cookie from request
let cookieParser = require('cookie-parser')
app.use(cookieParser())

//express json to accept json format of data
app.use(express.json());

//accepting form data
app.use(express.urlencoded())



console.log('Registering routes...');
//Home route
app.get('/',home)

//Route to handle items searched in the searchbox
app.post('/searchedItem',searchedItem)

//Route to handle signup
app.post('/signup',signup)

app.post("/detail",detail);

//Route to handle login through form
app.post('/login',login);

//route to handle login with Google
app.post('/googlelogin',googlelogin)

//Route to logout
app.get('/logout',logout)

//Route to get price of items added to the cart
app.get('/price',price)

app.post("/detailInfo",detailInfo)

const PORT=process.env.PORT||8000
app.listen(8000,()=>{
  console.log("Server started successfully!")
})
