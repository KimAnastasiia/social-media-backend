
const express = require('express');
const mysqlConnection = require("./mysqlConnection")
const crypto = require('crypto');
const routerMessages = express.Router();
const sharp = require('sharp');
const objectOfApiKey = require("./objectApiKey")
const jwt = require("jsonwebtoken");
const database= require("./database")

routerMessages.post("/",async(req,res)=>{

    let idReceiver = req.body.idReceiver
    let message= req.body.message
    const d = Date.now();

    database.connect();
    try{
        const sentMessage = await database.query("INSERT INTO messages (date, idSender, idReceiver, message) VALUES  ( "+ d+", "+ req.infoInToken.userId+",  "+ idReceiver+", '"+message+"' ) ")
        database.disConnect();
        res.send({message:"done"})
        return 
    } catch (error){
        console.log("Error")
        res.send({message:"error sending message"})
    }
})


module.exports=routerMessages