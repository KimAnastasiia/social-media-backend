const express = require('express');
const mysqlConnection = require("./mysqlConnection")
const crypto = require('crypto');
const routerComments = express.Router();
const sharp = require('sharp');
const objectOfApiKey = require("./objectApiKey")
const jwt = require("jsonwebtoken");
const database= require("./database")

routerComments.delete("/:id/:commentId/:userIdOfPublication",(req,res)=>{
    let postId = req.params.id
    let id = req.params.commentId
    let userIdOfPublication = req.params.userIdOfPublication

    if(userIdOfPublication==req.infoInToken.userId){

        mysqlConnection.query("DELETE FROM likesforcomments WHERE postId="+postId+" and commentId="+id,(errLikesForComments,rowsLikesForComments)=>{
            if (errLikesForComments){
                res.send({error: errLikesForComments});
                return ;
            }
            else{
                mysqlConnection.query("DELETE FROM comment WHERE postId="+postId+" and id="+id,(err,rows)=>{
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
    }else{
        mysqlConnection.query("DELETE FROM likesforcomments WHERE postId="+postId+" and commentId="+id,(errLikesForComments,rowsLikesForComments)=>{
            if (errLikesForComments){
                res.send({error: errLikesForComments});
                return ;
            }
            else{
                mysqlConnection.query("DELETE FROM comment WHERE postId="+postId+" and userId="+req.infoInToken.userId+" and id="+id,(err,rows)=>{
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
      
    }

})

routerComments.post('/',async (req, res) => {

    let postId  = req.body.postId
    let comment  = req.body.comment
    const d = Date.now();
    database.connect();
    try{
    const comments =await database.query("INSERT INTO comment ( userId, postId, comment, date ) VALUES (?, ?, ?, ?)", [req.infoInToken.userId,postId,comment,d])
    database.disConnect()
    res.send(
        {
            messege:"done",
            rows: comments
        })

    }catch(error){
        res.send({error: error});
        return ;
    }

})
routerComments.put('/:id',async (req, res) => {

    let comment = req.body.comment
    let postId = req.body.postId
    let id = req.params.id
    database.connect();

    try{
        const updatedComment =await database.query("UPDATE comment SET comment=? WHERE postId=? and userId=? and id=?", [comment,postId,req.infoInToken.userId,id])
        database.disConnect()
        res.send(
            {
                messege:"done",
                rows: updatedComment
            })
    
        }catch(error){
            res.send({error: error});
            return ;
        }

})


module.exports=routerComments