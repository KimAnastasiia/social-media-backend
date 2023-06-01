const express = require('express');
const routerCommentLikes = express.Router();
const database= require("./database")

routerCommentLikes.get("/",async(req,res)=>{
    database.connect();
    try{
        const likes=await database.query(`SELECT * from likesforcomments WHERE userId=?`,[ req.infoInToken.userId])
        database.disConnect()
        res.send(likes)
    }catch (error){
        console.log("Error")
        res.send({message:"error"})
    }
})

routerCommentLikes.post('/', async(req, res) => {

    let postId  = req.body.postId
    let commentId  = req.body.commentId

    database.connect();

    const rowsLikesForComments = await database.query("SELECT * FROM likesforcomments WHERE userId = ? AND commentId = ?", [req.infoInToken.userId, commentId])
    if(rowsLikesForComments.length==0){
       const rows=  await database.query("INSERT INTO likesforcomments ( userId, postId, commentId ) VALUES (?, ?, ?) ", [req.infoInToken.userId, postId, commentId])
       database.disConnect();
       res.send(
        {
            messege:"done",
            rows: rows
        })
    }else{
        await database.query("DELETE FROM likesforcomments WHERE postId=? and userId=? and commentId=?", [postId, req.infoInToken.userId, commentId])
        database.disConnect();
        res.send({messege:"done"})
    }

})

module.exports=routerCommentLikes