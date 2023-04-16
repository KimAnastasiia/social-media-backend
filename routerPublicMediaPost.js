const express = require('express');
const mysqlConnection = require("./mysqlConnection")
const crypto = require('crypto');
const routerPublicMediaPost = express.Router();
const sharp = require('sharp');
const objectOfApiKey = require("./objectApiKey")
const jwt = require("jsonwebtoken");


routerPublicMediaPost.get("/",(req,res,next)=>{
    
    let sqlQuery="SELECT * FROM post"

    let userId = req.query.userId
    if (userId!=undefined){
        sqlQuery= "SELECT * FROM post where userId="+userId
    }
 

    mysqlConnection.query(sqlQuery, (err, rows) => {
        if (err){
            res.send({error:err});
            return 
        } else {
            console.log(rows);
        }
        res.send(rows)
    })
  
})


routerPublicMediaPost.get("/:id",(req,res,next)=>{

    let id = req.params.id

    mysqlConnection.query("SELECT * FROM post where id="+id+"", (err, rows) => {

        if (err){
            res.send({error:err});
            return 
        } else {
            console.log(rows);
        }

        res.send(rows)
    })
})
module.exports=routerPublicMediaPost