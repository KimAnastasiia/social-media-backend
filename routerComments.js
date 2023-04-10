const express = require('express');
const mysqlConnection = require("./mysqlConnection")
const crypto = require('crypto');
const routerComments = express.Router();
const sharp = require('sharp');
const objectOfApiKey = require("./objectApiKey")
const jwt = require("jsonwebtoken");

routerComments.get("/:postId",(req,res,next)=>{
 
    let postId=req.params.postId

    mysqlConnection.query(`SELECT comment.userId, comment.comment, comment.postId, 
        comment.date, comment.id, user.name, user.surname, user.uniqueName
        FROM comment 
        JOIN user 
        ON comment.userId=user.id 
        where comment.postId=`+postId, (err, rows) => {
        if (err){
            res.send({error:err});
            return 
        } else {
            console.log(rows);
        }
        res.send(rows)
    })
  
})
module.exports=routerComments