const express = require('express');
const mysqlConnection = require("./mysqlConnection")
const crypto = require('crypto');
const routerUsers = express.Router();
let keyEncrypt = 'password';
let algorithm = 'aes256'
const objectOfApiKey = require("./objectApiKey")
const jwt = require("jsonwebtoken");

routerUsers.get("/",(req,res,next)=>{


    mysqlConnection.query("SELECT name, surname, phoneNumber, id, email, uniqueName from user WHERE id="+req.infoInToken.userId+"", (err, rows) => {

        if (err){
            res.send({error:err});
            return 
        } else {
            console.log(rows);
        }

        res.send(rows)
    })
})


module.exports=routerUsers