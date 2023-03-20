let {initDB,listDB,profileDB} = require("../dbConfig")
let jwt = require('jsonwebtoken')
let path = require('path')
const cookie = require('cookie');

//let jwt = require('jsonwebtoken')

// getting dummyJsonList collection
let prodList;
async function prodColl(){
     prodList=await initDB()
}

prodColl()

// getting list collection
let goods;
async function listColl(){
    goods=await listDB()
}
listColl()

// async function x(){
//  await prodColl()
// }
// x()

// getting profile collection
let profile;
async function profColl(){
    profile=await profileDB()
}
profColl()





let detail=async(req,res)=>{
    console.log("detail function called");
     let {id,title,price,description,thumbnail}= req.body;



    //Checking for duplicate data

     let duplicate=await prodList.find({"id":id}).toArray()
     
     if(duplicate.length==0){
       
        let result=await prodList.insertOne({"id":id,"title":title,"price":price,"description":description,"thumbnail":thumbnail})
        console.log("item added to cart");

     }

     //getting products data
       let totalItems=await prodList.find({},{"title":1,"thumbnail":1,"price":1}).toArray()

        let finalResult=await totalItems;

        console.log("finalResult line 29",finalResult)
        
        if(finalResult){
        res.send(finalResult)
        }
      
       // res.send("0");
     
     
     console.log("duplicate line 21",duplicate.length);
   
   try {

    let dataDb={
        "id":id,
        "title":title,
        "price":price,
        "description":description,
        "thumbnail":thumbnail
    }

    //res.send("Cart data received successfully at backend")


   } catch (error) {
    console.log("Error occured in details page",error)
   }
}


//this is alternative for the /detail route named as /detailInfo


let detailInfo=async(req,res)=>{
    console.log("detail function called");
     let {id,title,price,description,thumbnail}= req.body;
     let duplicate=await prodList.find({"id":id}).toArray()
     
     if(duplicate.length==0){
       
        
        let result=await prodList.insertOne({"id":id,"title":title,"price":price,"description":description,"thumbnail":thumbnail})
        console.log("item added to cart");
        let totalItems=await prodList.find({}).toArray()

        let finalResult;
        
            finalResult=await totalItems
        console.log("finalResult line 29",finalResult)
        
         

        if(finalResult){
            res.send(finalResult)
        }
      
       // res.send("0");
     }
     
     console.log("duplicate line 21",duplicate.length);
   
   try {

    let dataDb={
        "id":id,
        "title":title,
        "price":price,
        "description":description,
        "thumbnail":thumbnail
    }

    for(let i=0;i<1;i++){

        console.log("loop",dataDb);
    }

    res.send("Cart data received successfully at backend")


   } catch (error) {
    console.log("Error occured in details page",error)
   }
}






let home=async(req,res)=>{

    //getting all the data from prodList
    console.log("Server started at 8000!");
    let result=await prodList.find({}).toArray()
    console.log("result",result);
    let data=await result;
    console.log("data,line 42",data);

    res.send(data)

}


//searched item handling
let searchedItem=async(req,res)=>{
    //get data from request
    let { Item }=req.body;
    console.log("Item line 110",Item);

    //searching data in database
    let result = await goods.find({ "title": new RegExp(Item, "i") }).toArray();
    let info=await result
    console.log("result line 112",result)
    console.log("result line 106",info);
    //send data to Front end
    res.send(info);

}


//signup handling
let signup=async(req,res)=>{
    //get data from request body
    let {name,email,password}=req.body;
    console.log("name,email,password",name,email,password);

    //put all data in profile collection 
    let result=await profile.insertOne({"name":name,"email":email,"password":password,"cart":[]})
    res.send("data sent from singnup route")
}

//login handling
let login=async(req,res)=>{
    //get data from request body
    let { email,password}=req.body;
    console.log("email,password",email,password);

    //find data in profile
    let credentials=await profile.findOne({"email":email,"password":password})

    //checking for null
    if(!credentials){
        console.log("credentials not found");
        res.send('0');
    }
    else{

        //put userData in payload
        let userPayload={"email":credentials.email,"password":credentials.password}

        //sign and store token string
        let token = jwt.sign(userPayload,'jwtKey', { expiresIn: '1d', })
             console.log(token);
            //store token in cookie
             res.cookie('jwt', token,{httpOnly:true}, {
                sameSite: 'none',
                secure: true
              });
            console.log("Cookie added")
            //send 1 if done
            res.send('1')
            
    }


}

//googleLogin handling
let googlelogin=async (req,res)=>{
    //get data from request body
    let {email}=req.body;
    console.log("email",email);

    //find user
    let credentials=await profile.findOne({"email":email})

    //check for valid input
    if(!credentials){
        console.log("credentials not found");
        res.send('0');
    }
    else{
        //put user data in userPayload
        let userPayload={"email":credentials.email,"password":credentials.password}
        let token = jwt.sign(userPayload,'jwtKey', { expiresIn: '1d', })
             console.log(token);
             res.cookie('jwt', token,{httpOnly:true}, {
                sameSite: 'none',
                secure: true
              });
            console.log("Cookie added")
            res.send('1')
            
    }

}

//logout handler
let logout=(req,res)=>{
    res.cookie('jwt', '')
    console.log('logout');
    res.send("1")
}

//price of cart items handling 
let price= async (req,res)=>{

    //using aggregate finction to get specific data
    
    let result= await prodList.aggregate( [       
        {
            $project: {
                       "_id":0,
                       "price": 1
                    }
        }
     ] ).toArray()

     //adding all the prices
     let finalPrice=await result
     console.log("finalPrice",finalPrice);
     let x=0;
        for(let i=0;i<finalPrice.length;i++){
            x+=Number(finalPrice[i].price)
        }
     console.log("priceData",x);

     res.send(`${x}`)
    
}

//export modules
module.exports = {
    home,
    detail,
    searchedItem,
    signup,
    detailInfo,
    login,
    logout,
    price,
    googlelogin

}
