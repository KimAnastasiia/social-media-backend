const express = require('express');
const mysqlConnection = require("./mysqlConnection")
const crypto = require('crypto');
const routerFriends = express.Router();
let keyEncrypt = 'password';
let algorithm = 'aes256'
const objectOfApiKey = require("./objectApiKey")
const jwt = require("jsonwebtoken");
const sharp = require('sharp');

routerFriends.get("/",(req,res)=>{

    let followingId = req.query.followingId
    mysqlConnection.query("SELECT * from friends WHERE followers="+req.infoInToken.userId+" and following="+followingId, (err, rows) => {

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
routerFriends.post("/",(req,res)=>{

    let followingId = req.body.followingId
  
    mysqlConnection.query("SELECT * from friends WHERE following="+followingId+" and followers="+req.infoInToken.userId, (errUserFriend, rowsUserFriend) => {

        if (errUserFriend){
            res.send({error:errUserFriend});
            return 
        } else if(rowsUserFriend.length>0){
            res.send({message:"You are already following this user"});
            return 
        }else{
            mysqlConnection.query("INSERT INTO friends ( followers, following, subscription ) VALUES ("+req.infoInToken.userId+","+followingId+", false) ", (err, rows) => {

                if (err){
                    res.send({error: err});
                    return ;
                }
                else{
                res.send(
                    {
                        message:"done",
                        rows: rows
                    })
                }
            })
        }
    })
})
routerFriends.delete("/followers",(req,res)=>{

    let followersId = req.query.followersId
    mysqlConnection.query("DELETE FROM friends WHERE followers="+followersId+" and following="+req.infoInToken.userId+"",(err,rows)=>{
        if (err){
            res.send({error: err});
            return ;
        }
        else{
            console.log(rows)
        }
        res.send({messege:"done"})
    })
})
routerFriends.delete("/following",(req,res)=>{

    let followingId = req.query.followingId
    mysqlConnection.query("DELETE FROM friends WHERE following="+followingId+" and followers="+req.infoInToken.userId+"",(err,rows)=>{
        if (err){
            res.send({error: err});
            return ;
        }
        else{
            console.log(rows)
        }
        res.send({messege:"done"})
    })
})
routerFriends.delete("/",(req,res)=>{

    let followingId = req.query.followingId

    mysqlConnection.query("DELETE FROM friends WHERE followers="+req.infoInToken.userId+" and following="+followingId+"",(err,rows)=>{
        if (err){
            res.send({error: err});
            return ;
        }
        else{
            console.log(rows)
        }
        res.send({messege:"done"})
    })
})

module.exports=routerFriends
 