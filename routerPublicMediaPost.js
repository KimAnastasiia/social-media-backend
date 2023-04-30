const express = require('express');
const mysqlConnection = require("./mysqlConnection")
const crypto = require('crypto');
const routerPublicMediaPost = express.Router();
const sharp = require('sharp');
const objectOfApiKey = require("./objectApiKey")
const jwt = require("jsonwebtoken");
const database= require("./database")

routerPublicMediaPost.get("/",(req,res)=>{
    
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



routerPublicMediaPost.get("/postes",async(req,res)=>{
    let p = req.query.p 
    p=(p-1)*6
    let userId = req.query.userId

    database.connect();
    const users = await database.query("SELECT * FROM user where id="+userId)
    if(users[0].close==1){
        res.send({close:true});
        database.disConnect();
        return 
    }
    const posts = await database.query("SELECT * FROM post where userId="+userId+ " LIMIT 6 OFFSET "+p)
    database.disConnect();
    res.send(posts)
  
})
routerPublicMediaPost.get("/count",(req,res)=>{

    let id = req.query.id
    mysqlConnection.query('SELECT COUNT(*) AS number FROM post WHERE userId=' +id, (err, rows) => {

        if (err){
            res.send({error:err});
            return
        }
        else{
            res.send(rows)
        }
    })
})

routerPublicMediaPost.get("/:id",(req,res)=>{

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