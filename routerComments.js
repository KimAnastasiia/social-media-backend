const express = require('express');
const routerComments = express.Router();
const database= require("./database")

routerComments.delete("/:id/:commentId/:userIdOfPublication",async(req,res)=>{
    let postId = req.params.id
    let id = req.params.commentId
    let userIdOfPublication = req.params.userIdOfPublication


    database.connect()

    if(userIdOfPublication==req.infoInToken.userId){
        try{
            await database.query("DELETE FROM likesforcomments WHERE postId=? and commentId=?", [postId,id ])
            await database.query("DELETE FROM comment WHERE postId=? and id=?", [postId,id ])
            database.disConnect()
            return res.send({messege:"done"})
        }catch(error){
            database.disConnect()
            return res.send({error:error});
        }
    }else{
        try{
            await database.query("DELETE FROM likesforcomments WHERE postId=? and commentId=?", [postId, id ])
            await database.query("DELETE FROM comment WHERE postId=? and userId=? and id=?", [postId, req.infoInToken.userId, id ])
            database.disConnect()
            return res.send({messege:"done"})
        }catch(error){
            database.disConnect()
            return res.send({error:error});
        }
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