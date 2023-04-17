const express = require('express');
const mysqlConnection = require("./mysqlConnection")
const crypto = require('crypto');
const routerPublicPostLike = express.Router();
const sharp = require('sharp');
const objectOfApiKey = require("./objectApiKey")
const jwt = require("jsonwebtoken");

routerPublicPostLike.get("/:postId",(req,res,next)=>{

    let postId = req.params.postId

    mysqlConnection.query(`SELECT COUNT(id) as totalLikes FROM likesofpost
    WHERE postId =` + postId, (errCount, rowsCount) => {

        if (errCount){
            res.send({error:errCount});
            return 
        } else {
            mysqlConnection.query(`SELECT user.uniqueName
            from likesofpost
            JOIN user 
            ON likesofpost.userid = user.id
            WHERE likesofpost.postId =`+postId, (errName, rowsName) => {
    
            if (errName){
                res.send({error:errName});
                return 
            } else {
                console.log(rowsName);
            }
    
            res.send({
                rowsCount:rowsCount,
                rowsName:rowsName
            })
        })
        }
    })
    
})

module.exports=routerPublicPostLike