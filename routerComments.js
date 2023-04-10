const express = require('express');
const mysqlConnection = require("./mysqlConnection")
const crypto = require('crypto');
const routerComments = express.Router();
const sharp = require('sharp');
const objectOfApiKey = require("./objectApiKey")
const jwt = require("jsonwebtoken");


routerComments.delete("/:id",(req,res)=>{
    let id = req.params.id
    let apiKey = req.query.apiKey
  
    let obj = objectOfApiKey.find((obj)=>
      obj===apiKey
    )
    if(!obj){
        res.send({error:"error"})
        return
    }
    
    let infoInToken = jwt.verify(apiKey, "secret");
    req.infoInToken = infoInToken;
    mysqlConnection.query("DELETE FROM comment WHERE postId="+id+" and userId="+req.infoInToken.userId,(err,rows)=>{
        if (err){
            res.send({error: err});
            return ;
        }
        else{
            console.log(rows)
        }
        res.send({messege:"done"})
    }
)})
module.exports=routerComments