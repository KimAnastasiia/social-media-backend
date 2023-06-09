const express = require('express')
const app = express()
const port = 4000
app.use(express.static('public'));
app.use(express.json())
var cors = require('cors')
app.use(cors())
const database= require("./database")

const objectOfApiKey = require("./objectApiKey")
const routerUsers =  require("./routerUsers")
const routerMediaPost = require('./routerMediaPost');
const routerComments = require("./routerComments")
const routerPublicComments= require("./routerPublicComments")
const routerCommentLikes = require('./routerCommentLikes');
// IMPORTANT for UPLOAD pictures
var fileUpload = require('express-fileupload');
app.use(fileUpload());


app.use(express.json())
const jwt = require("jsonwebtoken");
const routerPublicMediaPost = require('./routerPublicMediaPost');
const routerPostLike = require('./routerPostLike');
const routerPublicPostLike = require('./routerPublicPostLike');
const routerPublicUsers = require('./routerPublicUsers');
const routerFriends = require('./routerFriends');
const routerPublicFriends = require('./routerPublicFriends');
const routerMessages = require('./routerMessages');

app.use(["/comments", "/likes", "/mediaPost", "/postLikes", "/users", "/friends","/messages"] ,async(req,res,next)=>{
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
    
    const d = Date.now();
    database.connect();
    const lastTime=await database.query("UPDATE user SET lastTimeConnected=? where id=?",[d, req.infoInToken.userId])
    database.disConnect()

    next()
})

app.use("/likes", routerCommentLikes)
app.use("/public/users", routerPublicUsers)
app.use("/mediaPost", routerMediaPost)
app.use("/comments", routerComments)
app.use("/public/comments", routerPublicComments)
app.use("/public/mediaPost", routerPublicMediaPost)
app.use("/postLikes", routerPostLike)
app.use("/public/postLikes", routerPublicPostLike)
app.use("/users", routerUsers)
app.use("/friends", routerFriends)
app.use("/public/friends", routerPublicFriends)
app.use("/messages", routerMessages)
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})