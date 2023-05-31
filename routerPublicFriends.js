const express = require('express');
const routerPublicFriends = express.Router();
const database= require("./database")

routerPublicFriends.get("/followers",async(req,res)=>{

    let id = req.query.id
    database.connect();

    const user = await database.query("SELECT * FROM user WHERE id=?",[id])

    if(user[0].close == 1){
        const followersClose = await database.query("SELECT * FROM friends JOIN user ON user.id=friends.followers WHERE following=? and subscription=1",[id])
        database.disConnect();
        return res.send({
            followers:followersClose
        });

    }else{
        const followersOpen = await database.query("SELECT * FROM friends JOIN user ON user.id=friends.followers WHERE following=?",[id])
        database.disConnect();
        return res.send({
            followers:followersOpen
        });
    }
})

routerPublicFriends.get("/following",async(req,res)=>{

    let id = req.query.id
    database.connect();
    const user = await database.query("SELECT * FROM user WHERE id=?",[id])
    if(user[0].close == 1){
        const followingClose = await database.query("SELECT * FROM friends JOIN user ON user.id=friends.following WHERE followers=? and subscription=1",[id])
        database.disConnect();
        return res.send({
            following:followingClose
        });
        
    }else{
        const followingOpen = await database.query("SELECT * FROM friends JOIN user ON user.id=friends.following WHERE followers=?",[id])
        database.disConnect();
        return res.send({
            following:followingOpen
        });
   
    }

})
module.exports=routerPublicFriends