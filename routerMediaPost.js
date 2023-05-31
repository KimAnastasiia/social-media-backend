const express = require('express');
const mysqlConnection = require("./mysqlConnection")
const crypto = require('crypto');
const routerMediaPost = express.Router();
const sharp = require('sharp');
const objectOfApiKey = require("./objectApiKey")
const jwt = require("jsonwebtoken");
const database= require("./database")

const STATE_PRIVATE_ACCOUNT = 1
const STATE_WAITING_FOR_RESPONSE = 2


routerMediaPost.get("/",async(req,res)=>{
    let p = req.query.p 
    let userId = req.query.userId
    let errorMessages=[]

    if(p== undefined ){
        errorMessages.push("paragraph undefined")
    }
    if(userId == undefined ){
        errorMessages.push("userId undefined")
    }
    if(errorMessages.length>0){
        res.send({error:errorMessages})
        return 
    }
    
    p=(p-1)*6
    database.connect();

    const users = await database.query("SELECT * FROM user where id=?", [userId])
    if(users[0].close==1){

       const friend=  await database.query("SELECT * FROM friends WHERE following =? AND followers =?", [userId, req.infoInToken.userId])
       
       if(friend.length>0 && friend[0].subscription == 1){
            const posts = await database.query("SELECT * FROM post where userId=? ORDER BY id DESC  LIMIT 6 OFFSET ?", [userId, p])
            database.disConnect();
            return res.send(posts)
       }else if(userId==req.infoInToken.userId){
            const posts = await database.query("SELECT * FROM post where userId=? ORDER BY id DESC  LIMIT 6 OFFSET ?", [userId, p])
            database.disConnect();
            res.send(posts)
            return
        }else if(friend.length>0 && friend[0].subscription == 0){
            return res.send(
                {
                    message:"Wait for a response from the user",
                    code:STATE_WAITING_FOR_RESPONSE
                });
           
        }
        else if(friend.length==0){
            database.disConnect();
            return res.send({
                message:"This is a private account, subscribe to see publications",
                code:STATE_PRIVATE_ACCOUNT
            });   
       }else{
        const posts = await database.query("SELECT * FROM post where userId=? ORDER BY id DESC LIMIT 6 OFFSET ? ", [userId, p])
        database.disConnect();
        return res.send(posts)
        }
    }else{
        const posts = await database.query("SELECT * FROM post where userId=? ORDER BY id DESC LIMIT 6 OFFSET ?", [userId, p])
        database.disConnect();
        return res.send(posts)
    }

   
  
})


routerMediaPost.get("/lastPost",async(req,res)=>{
    database.connect();
    let userId = req.query.userId
    try{
        const post=await database.query(`SELECT post.id AS postId , user.id as userId, comment, date, name, surname,uniqueName, lastTimeConnected 
        FROM post 
        JOIN user
        ON user.id = post.userId
        WHERE userId =?
        ORDER BY post.id DESC LIMIT 1`,[userId])
        database.disConnect()
        return res.send(post)
    }catch (error){
        console.log("Error")
        return res.send({message:"error"})
    }
})


routerMediaPost.post('/', async(req, res) => {

    const d = Date.now();
    let img = req.files.myImage
    let comment = req.body.comment

    database.connect();

    try{
        const post=await database.query("INSERT INTO post (userId, comment, date) VALUES  ( ?, ?, ?) ",[req.infoInToken.userId, comment, d])
        const user=await database.query("SELECT * FROM user WHERE id=?", [req.infoInToken.userId])
        if(user.length>0){
            if (img != null) {
               
                img.mv('public/images/' + req.infoInToken.userId.toString()+ post.insertId.toString()  +'.png', async (err) => {

                    if(err){
                        database.disConnect()
                        return res.send({error:err });
                    }

                    let infoPicMini = await sharp('public/images/' + req.infoInToken.userId.toString() + post.insertId.toString()  +'.png')
                        .resize(309,309).toFile('public/images/' + req.infoInToken.userId.toString()+ post.insertId.toString()  +'mini.png')

                    let infoPicBig = await sharp('public/images/' + req.infoInToken.userId.toString() + post.insertId.toString()  +'.png')
                        .resize(1080,1350).toFile('public/images/' + req.infoInToken.userId.toString()+ post.insertId.toString()  +'big.png')

                    database.disConnect()
                    return res.send(post);
                })
    
            }else{
                database.disConnect()
                return res.send(post)
            }
        }
    }catch (error){
        res.send({message:"error"})
    }

})


routerMediaPost.delete('/:postId', async(req, res) => {
    
    let postId = req.params.postId
    database.connect();

    try{
        await database.query("DELETE FROM likesforcomments WHERE postId=?", [postId])
        await database.query("DELETE FROM comment WHERE postId=?",[postId])
        await database.query("DELETE FROM likesofpost WHERE postId=?", [postId])
        await database.query("DELETE FROM post WHERE id=?",[postId])
        database.disConnect();
        res.send({messege:"done"})

    } catch (error){
        return res.send({error: error});
    }
})

module.exports=routerMediaPost
