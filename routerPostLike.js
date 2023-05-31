
const express = require('express');
const routerPostLike = express.Router();
const database= require("./database")


routerPostLike.get("/:postId",async(req,res)=>{

    let postId = req.params.postId
    database.connect();

    try{
        const postsLikes=await database.query("SELECT * from likesofpost where userId=? and postId=?", [req.infoInToken.userId,postId ])
        database.disConnect();
        return res.send(postsLikes)
    }catch(err){
        database.disConnect();
        return res.send({error:err});
    }

})

routerPostLike.post('/',async (req, res) => {

    let postId  = req.body.postId

    database.connect();

    try{
        const likesOfPost=await database.query("SELECT * FROM likesofpost WHERE userId =? AND postId = ?", [req.infoInToken.userId,postId ])
        if(likesOfPost.length==0){
            const inseretLike= await database.query("INSERT INTO likesofpost ( userId, postId ) VALUES (?,?) ", [req.infoInToken.userId,postId ])
            database.disConnect();
            return res.send(
                {
                    messege:"done",
                    rows: inseretLike
                })
            
        }else{
            await database.query("DELETE FROM likesofpost WHERE postId=? and userId=?", [postId, req.infoInToken.userId ])
            database.disConnect();
            return res.send({messege:"done"})
        }
    }catch(err){
        database.disConnect();
        return res.send({error:err});
    }
    
})

module.exports=routerPostLike