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
    WHERE postId =` + postId, (err, rows) => {

        if (err){
            res.send({error:err});
            return 
        } else {
            console.log(rows);
        }

        res.send(rows)
    })
})

module.exports=routerPublicPostLike