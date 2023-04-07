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
// IMPORTANT for UPLOAD pictures
var fileUpload = require('express-fileupload');
app.use(fileUpload());


app.use(express.json())
const jwt = require("jsonwebtoken");
/** 
app.use(["/mediaPost"] ,(req,res,next)=>{
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
*/

app.use("/users", routerUsers)
app.use("/mediaPost", routerMediaPost)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})