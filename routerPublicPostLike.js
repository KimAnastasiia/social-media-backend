const express = require('express');
const routerPublicPostLike = express.Router();
const database= require("./database")


routerPublicPostLike.get("/:postId",async(req,res)=>{

    let postId = req.params.postId
    database.connect();


    try{
        const rowsCount = await database.query(`SELECT COUNT(id) as totalLikes FROM likesofpost WHERE postId =?`,[postId])
        database.disConnect()
        return res.send({
            rowsCount:rowsCount
        })
    }catch(error){
        database.disConnect()
        return res.send({error:error});
    }
    
})

module.exports=routerPublicPostLike