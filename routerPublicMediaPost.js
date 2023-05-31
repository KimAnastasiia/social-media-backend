const express = require('express');
const routerPublicMediaPost = express.Router();
const database= require("./database")

routerPublicMediaPost.get("/",async(req,res)=>{
    
    let sqlQuery="SELECT * FROM post"

    let userId = req.query.userId
    if (userId!=undefined){
        sqlQuery= "SELECT * FROM post where userId="+userId
    }
 
    database.connect();

    try{
        const post=await database.query(sqlQuery)
        database.disConnect()
        return res.send(post)
    }catch(error){
        database.disConnect()
        return res.send({error:error});
    }
})



routerPublicMediaPost.get("/postes",async(req,res)=>{
    let p = req.query.p 
    p=(p-1)*6
    let userId = req.query.userId

    database.connect();

    const users = await database.query("SELECT * FROM user where id=?",[userId])
    if(users[0].close==1){
        database.disConnect();
        return res.send({close:true});
    }else{
        const posts = await database.query("SELECT * FROM post where userId=? ORDER BY id DESC  LIMIT 6 OFFSET ?", [userId, p])
        database.disConnect();
        return res.send(posts)
    }
  
})


routerPublicMediaPost.get("/count",async(req,res)=>{

    let id = req.query.id
    database.connect();

    try{
        let countPost=await database.query('SELECT COUNT(*) AS number FROM post WHERE userId=?', [id])
        database.disConnect();
        return res.send(countPost)
    }catch(error){
        database.disConnect();
        return res.send({error:error});
    }
})

routerPublicMediaPost.get("/:id",async(req,res)=>{

    let id = req.params.id
    database.connect();

    try{
        const post= await database.query("SELECT * FROM post where id=?", [id])
        database.disConnect();
        return res.send(post);
    }catch(error){
        database.disConnect();
        return res.send({error:error});
    }
})
module.exports=routerPublicMediaPost