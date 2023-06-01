const express = require('express');
const routerFriends = express.Router();
const database= require("./database")



routerFriends.get("/",async(req,res)=>{

    let followingId = req.query.followingId
    if(followingId!=req.infoInToken.userId){

        database.connect();

        try{
            let friends=await database.query("SELECT * from friends WHERE followers=? and following=?",[req.infoInToken.userId, followingId ])
            
            if(friends.length>0){
                database.disConnect()
                return  res.send({message:true});
            }else if(friends.length==0){
                database.disConnect()
                return res.send({message:false});
            }
        }catch(error){
            return  res.send({error:error});
        }
    }
})



routerFriends.get("/subscriptionRequests",async(req,res)=>{

    database.connect();
    try{

        const subscriptionRequests = await database.query("SELECT * FROM friends JOIN user ON friends.followers=user.id where following="+req.infoInToken.userId+" and subscription = 0")
        database.disConnect();
        return res.send(subscriptionRequests)

    }catch(error){
        return  res.send({error:error});
      
    }

})



routerFriends.post("/",async(req,res)=>{

    let followingId = req.body.followingId
    const d = Date.now();
    database.connect();

    try{
        
        const userFriend = await database.query("SELECT * from friends WHERE following=? and followers=?", [followingId,req.infoInToken.userId ])
        
        if(userFriend.length>0){
            database.disConnect()
            return res.send({message:"You are already following this user"});
        }else{
           
            const insertedUser= await database.query("INSERT INTO friends ( followers, following, subscription, date ) VALUES (?, ?, false, ?) ",[req.infoInToken.userId,followingId,d])
            database.disConnect()
            return res.send(
                {
                    message:"done",
                    rows: insertedUser
                })
        }

    }catch(error){
        return res.send({error:error});
    }
})


routerFriends.put('/', async(req, res) => {
    let followerId=req.body.followerId
    database.connect();
    try{
        await database.query("UPDATE friends SET subscription=1 where following=? and followers=?", [req.infoInToken.userId,followerId ])
        database.disConnect();
        return res.send({message:"done"})
      
    } catch (error){
        console.log("Error")
        return res.send({message:"error while accepting friend request"})
    }
})




routerFriends.delete("/followers",async(req,res)=>{

    let followersId = req.query.followersId
    database.connect();
    try{
        await database.query("DELETE FROM friends WHERE followers=? and following=?",[followersId,req.infoInToken.userId ])
        database.disConnect();
        return res.send({message:"done"})
      
    } catch (error){
        return res.send({error: error});
    }
})



routerFriends.delete("/following",async(req,res)=>{

    let followingId = req.query.followingId
    database.connect();
    try{
        await database.query("DELETE FROM friends WHERE following=? and followers=?",[followingId,req.infoInToken.userId ])
        database.disConnect();
        return res.send({message:"done"})
      
    } catch (error){
        return res.send({error: error});
    }
})



routerFriends.delete("/",async(req,res)=>{

    let followingId = req.query.followingId
    database.connect();
    try{
        await database.query("DELETE FROM friends WHERE followers=? and following=?",[req.infoInToken.userId, followingId ])
        database.disConnect();
        return res.send({message:"done"})
      
    } catch (error){
        return res.send({error: error});
    }

})

module.exports=routerFriends
 