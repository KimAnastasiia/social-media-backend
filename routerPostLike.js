
const express = require('express');
const mysqlConnection = require("./mysqlConnection")
const crypto = require('crypto');
const routerPostLike = express.Router();
const sharp = require('sharp');
const objectOfApiKey = require("./objectApiKey")
const jwt = require("jsonwebtoken");

routerPostLike.get("/:postId",(req,res,next)=>{

    let postId = req.params.postId

    mysqlConnection.query("SELECT * from likesofpost where userId="+req.infoInToken.userId+" and postId="+postId, (err, rows) => {

        if (err){
            res.send({error:err});
            return 
        } else {
            console.log(rows);
        }

        res.send(rows)
    })
})

routerPostLike.post('/', (req, res) => {

    let postId  = req.body.postId
    mysqlConnection.query("SELECT * FROM likesofpost WHERE userId = "+req.infoInToken.userId+" AND postId = "+postId+"", (errLikesOfPost, rowsLikesOfPost) => {

        if (errLikesOfPost){
            res.send({error:errLikesOfPost});
            return 
        }  
        if(rowsLikesOfPost.length==0){
            mysqlConnection.query("INSERT INTO likesofpost ( userId, postId ) VALUES ("+req.infoInToken.userId+","+postId+") ", (err, rows) => {

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
            mysqlConnection.query("DELETE FROM likesofpost WHERE postId="+postId+" and userId="+req.infoInToken.userId+"",(err,rows)=>{
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

module.exports=routerPostLike