
const express = require('express');
const mysqlConnection = require("./mysqlConnection")
const crypto = require('crypto');
const routerPostLike = express.Router();
const sharp = require('sharp');
const objectOfApiKey = require("./objectApiKey")
const jwt = require("jsonwebtoken");


routerPostLike.post('/like', (req, res) => {

    let postId  = req.body.postId

    mysqlConnection.query("INSERT INTO likesofpost ( userId, postId ) VALUES ("+req.infoInToken.userId+","+postId+") ", (err, rows) => {

        if (err){
            res.send({error: err});
            return ;
        }
        else{
        res.send(
            {
                messege:"done",
                rows: rows
            })
        }
    })

})

module.exports=routerPostLike