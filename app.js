const express = require('express')
const app = express()
const port = 4000
app.use(express.static('public'));
app.use(express.json())
var cors = require('cors')
app.use(cors())


const objectOfApiKey = require("./objectApiKey")
const routerUsers =  require("./routerUsers")
const routerMediaPost = require('./routerMediaPost');
const routerComments = require("./routerComments")
const routerPublicComments= require("./routerPublicComments")
// IMPORTANT for UPLOAD pictures
var fileUpload = require('express-fileupload');
app.use(fileUpload());


app.use(express.json())
const jwt = require("jsonwebtoken");

app.use(["/comments"] ,(req,res,next)=>{
    let apiKey = req.query.apiKey
  
    let obj = objectOfApiKey.find((obj)=>
      obj===apiKey
    )
    if(!obj){
        res.send({error:"error"})
        return
    }
    
    let infoInToken = jwt.verify(apiKey, "secret");
    req.infoInToken = infoInToken;

    next()
})


app.use("/users", routerUsers)
app.use("/mediaPost", routerMediaPost)
app.use("/comments", routerComments)
app.use("/public/comments", routerPublicComments)
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})