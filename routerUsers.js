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

routerUsers.put("/",(req,res,next)=>{

    let name = req.body.name
    let surname = req.body.surname
    let phoneNumber = req.body.phoneNumber
    let email = req.body.email
    let uniqueName = req.body.uniqueName
    let presentation = req.body.presentation

    mysqlConnection.query("UPDATE user SET name= '"+name+"', surname='"+surname+"', phoneNumber='"+phoneNumber+"', email='"+email+"', uniqueName='"+uniqueName+"', presentation='"+presentation+"' where id= "+req.infoInToken.userId, (err, rows) => {

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