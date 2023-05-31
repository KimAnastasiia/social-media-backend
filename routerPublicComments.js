const express = require('express');
const routerPublicComments = express.Router();
const database= require("./database")

routerPublicComments.get("/",async(req,res)=>{
 
    database.connect();
    try{
        const totalLikes = await database.query(`SELECT comment.*, COUNT(likesforcomments.id) as totalLikes FROM comment 
        left JOIN likesforcomments
        ON comment.id = likesforcomments.commentId 
        GROUP BY comment.id`)
        database.disConnect();
        return res.send(totalLikes)
    }catch(error){
        database.disConnect();
        return res.send({error:err});
    }
  
})
routerPublicComments.get("/:postId",async(req,res)=>{
 
    let postId=req.params.postId
    database.connect();
    try{
        const commentOfUser = await database.query(`SELECT comment.userId, comment.comment, comment.postId, 
        comment.date, comment.id, user.name, user.surname, user.uniqueName
        FROM comment 
        JOIN user 
        ON comment.userId=user.id 
        where comment.postId=?`,[postId])
        database.disConnect();
        return res.send(commentOfUser)
    }catch(error){
        database.disConnect();
        return res.send({error:err});
    }
})


module.exports=routerPublicComments