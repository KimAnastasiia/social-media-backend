const express = require('express');
const mysqlConnection = require("./mysqlConnection")
const crypto = require('crypto');
const routerCommentLikes = express.Router();
const sharp = require('sharp');
const objectOfApiKey = require("./objectApiKey")
const jwt = require("jsonwebtoken");



routerCommentLikes.post('/', (req, res) => {

    let postId  = req.body.postId
    let commentId  = req.body.commentId
    
    mysqlConnection.query("SELECT * FROM likesforcomments WHERE userId = "+req.infoInToken.userId+" AND commentId = "+commentId+"", (errLikesForComments, rowsLikesForComments) => {

        if (errLikesForComments){
            res.send({error:errLikesForComments});
            return 
        } 
        if(rowsLikesForComments.length==0){

            mysqlConnection.query("INSERT INTO likesforcomments ( userId, postId, commentId ) VALUES ("+req.infoInToken.userId+","+postId+","+commentId+") ", (err, rows) => {

                if (err){
                    res.send({error: err});
                    return ;
                }
                else{
                res.send(
                    {
                        messege:"done",
                        rows: rows
                    })
                }
            })
        }else{
            mysqlConnection.query("DELETE FROM likesforcomments WHERE postId="+postId+" and userId="+req.infoInToken.userId+" and commentId="+commentId,(err,rows)=>{
                if (err){
                    res.send({error: err});
                    return ;
                }
                else{
                    console.log(rows)
                }
                res.send({messege:"done"})
            })
        }
})

})

module.exports=routerCommentLikes