const express = require('express');
const mysqlConnection = require("./mysqlConnection")
const crypto = require('crypto');
const routerPublicFriends = express.Router();
let keyEncrypt = 'password';
let algorithm = 'aes256'
const objectOfApiKey = require("./objectApiKey")
const jwt = require("jsonwebtoken");
const sharp = require('sharp');

routerPublicFriends.get("/",(req,res)=>{

    let id = req.query.id

    mysqlConnection.query("SELECT COUNT(friendId) AS following FROM friends WHERE userId="+id, (err, rows) => {

        if (err){
            res.send({error:err});
            return 
        } else {
            mysqlConnection.query("SELECT COUNT(friendId) AS followers FROM friends WHERE friendId="+id, (errFollowers, rowsFollowers) => {

                if (errFollowers){
                    res.send({error:errFollowers});
                    return 
                } else {
                    res.send({
                        following:rows,
                        followers:rowsFollowers
                    });
                    return 
                }
            })
        }
    })


})

routerPublicFriends.get("/followers",(req,res)=>{

    let id = req.query.id

    mysqlConnection.query("SELECT * FROM friends JOIN user ON user.id=friends.userId WHERE friendId="+id, (errFollowers, rowsFollowers) => {

        if (errFollowers){
            res.send({error:errFollowers});
            return 
        } else {
            res.send({
                followers:rowsFollowers
            });
            return 
        }
    })
})


module.exports=routerPublicFriends