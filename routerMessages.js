
const express = require('express');
const mysqlConnection = require("./mysqlConnection")
const crypto = require('crypto');
const routerMessages = express.Router();
const sharp = require('sharp');
const objectOfApiKey = require("./objectApiKey")
const jwt = require("jsonwebtoken");
const database= require("./database")

routerMessages.get("/dialogues",async(req,res)=>{
    database.connect();
    try{
        const dialogues = await database.query(
        `SELECT messages.*, sender.uniqueName AS sender_uniqueName, receiver.uniqueName AS receiver_uniqueName
        FROM messages
        JOIN user sender ON sender.id = messages.idSender
        JOIN user receiver ON receiver.id = messages.idReceiver 
        Where idSender=`+ req.infoInToken.userId +" or idReceiver=" + req.infoInToken.userId+` GROUP BY LEAST(idSender, idReceiver), GREATEST(idSender, idReceiver);`)
        database.disConnect();
        res.send(dialogues)
        return 
    }catch (error){
        res.send({message:"error while fetching dialogues"})
    }
})

routerMessages.get("/:idReceiver",async(req,res)=>{

    let time = req.query.time
    if(time==undefined){
        time=0
    }

    let idReceiver= req.params.idReceiver
    database.connect();
    try{
        const chat = await database.query(`SELECT  messages.date, messages.message, user.id AS userId, user.uniqueName, messages.id AS messageId
        FROM messages 
        JOIN user 
        ON user.id=messages.idSender 
        where messages.date > ? and (( idSender=? and idReceiver=?) or (idReceiver=? and idSender=?))`, 
        [time,req.infoInToken.userId,idReceiver, req.infoInToken.userId,idReceiver  ])
        database.disConnect();
        res.send(chat)
        return 
    }catch (error){
        res.send({message:"error while fetching messages"})
    }
})
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
routerMessages.delete('/',async (req, res) =>{
    let companionId = req.query.companionId
    database.connect();
    try{
        const deleteDialogue = await database.query("DELETE FROM messages WHERE idSender="+req.infoInToken.userId+ " and idReceiver="+companionId+ " or idReceiver="+req.infoInToken.userId+" and idSender="+companionId)
        database.disConnect();
        res.send({message:"done"})
        return 
    } catch (error){
        console.log("Error")
        res.send({message:"error delete dialogue"})
    }
})
routerMessages.delete('/messages',async (req, res) =>{
    let companionId = req.query.companionId
    let id=req.query.id
    database.connect();
    try{
        const deleteDialogue = await database.query("DELETE FROM messages WHERE idSender="+req.infoInToken.userId+ " and idReceiver="+companionId+ " and id="+id+ "  or idReceiver="+req.infoInToken.userId+" and idSender="+companionId+" and id="+id )
        database.disConnect();
        res.send({message:"done"})
        return 
    } catch (error){
        console.log("Error")
        res.send({message:"error delete messages"})
    }
})
module.exports=routerMessages