const express = require('express');
const mysqlConnection = require("./mysqlConnection")
const crypto = require('crypto');
const routerFriends = express.Router();
let keyEncrypt = 'password';
let algorithm = 'aes256'
const objectOfApiKey = require("./objectApiKey")
const jwt = require("jsonwebtoken");
const sharp = require('sharp');

routerFriends.get("/",(req,res,next)=>{

    let friendId = req.query.friendId
    mysqlConnection.query("SELECT * from friends WHERE userId="+req.infoInToken.userId+" and friendId="+friendId, (err, rows) => {

        if (err){
            res.send({error:err});
            return 
        } else if(rows.length>0){
            res.send({message:true});
            return 
        }else if(rows.length==0){
            res.send({message:false});
            return 
        }
    })
})
module.exports=routerFriends
 