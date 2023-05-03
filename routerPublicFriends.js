const express = require('express');
const mysqlConnection = require("./mysqlConnection")
const crypto = require('crypto');
const routerPublicFriends = express.Router();
let keyEncrypt = 'password';
let algorithm = 'aes256'
const objectOfApiKey = require("./objectApiKey")
const jwt = require("jsonwebtoken");
const sharp = require('sharp');
const database= require("./database")

routerPublicFriends.get("/followers",async(req,res)=>{

    let id = req.query.id
    database.connect();
    const user = await database.query("SELECT * FROM user WHERE id="+id)
    if(user[0].close == 1){
        const followersClose = await database.query("SELECT * FROM friends JOIN user ON user.id=friends.followers WHERE following="+id+" and subscription=1")
        database.disConnect();
        res.send({
            followers:followersClose
        });
        return 
    }else{
        const followersOpen = await database.query("SELECT * FROM friends JOIN user ON user.id=friends.followers WHERE following="+id)
        database.disConnect();
        res.send({
            followers:followersOpen
        });
        return 
    }
})

routerPublicFriends.get("/following",(req,res)=>{

    let id = req.query.id

    mysqlConnection.query("SELECT * FROM friends JOIN user ON user.id=friends.following WHERE followers="+id, (errFollowing, rowsFollowing) => {

        if (errFollowing){
            res.send({error:errFollowing});
            return 
        } else {
            res.send({
                following:rowsFollowing
            });
            return     
        }
 
    })

})
module.exports=routerPublicFriends