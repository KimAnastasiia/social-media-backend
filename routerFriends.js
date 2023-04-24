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
routerFriends.post("/",(req,res,next)=>{

    let friendId = req.body.friendId
  
    mysqlConnection.query("SELECT * from friends WHERE friendId="+friendId+" and userId="+req.infoInToken.userId, (errUserFriend, rowsUserFriend) => {

        if (errUserFriend){
            res.send({error:errUserFriend});
            return 
        } else if(rowsUserFriend.length>0){
            res.send({message:"You are already following this user"});
            return 
        }else{
            mysqlConnection.query("INSERT INTO friends ( userId, friendId, subscription ) VALUES ("+req.infoInToken.userId+","+friendId+", false) ", (err, rows) => {

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
routerFriends.delete("/:friendId",(req,res,next)=>{

    let friendId = req.params.friendId
    mysqlConnection.query("DELETE FROM friends WHERE userId="+req.infoInToken.userId+" and friendId="+friendId+"",(err,rows)=>{
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
 