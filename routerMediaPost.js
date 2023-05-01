const express = require('express');
const mysqlConnection = require("./mysqlConnection")
const crypto = require('crypto');
const routerMediaPost = express.Router();
const sharp = require('sharp');
const objectOfApiKey = require("./objectApiKey")
const jwt = require("jsonwebtoken");
const database= require("./database")

const STATE_PRIVATE_ACCOUNT = 1
const STATE_WAITING_FOR_RESPONSE = 2



routerMediaPost.get("/",async(req,res)=>{
    let p = req.query.p 
    p=(p-1)*6
    let userId = req.query.userId

    database.connect();

    const users = await database.query("SELECT * FROM user where id="+userId)
    if(users[0].close==1){

       const friend=  await database.query("SELECT * FROM friends WHERE following ="+userId+" AND followers ="+ req.infoInToken.userId)
       
       if(friend.length>0 && friend[0].subscription == 1){
            const posts = await database.query("SELECT * FROM post where userId="+userId+ " LIMIT 6 OFFSET "+p)
            database.disConnect();
            res.send(posts)
            return 
       }else if(userId==req.infoInToken.userId){
            const posts = await database.query("SELECT * FROM post where userId="+userId+ " LIMIT 6 OFFSET "+p)
            database.disConnect();
            res.send(posts)
            return
        }else if(friend.length>0 && friend[0].subscription == 0){
            res.send(
                {
                    message:"Wait for a response from the user",
                    code:STATE_WAITING_FOR_RESPONSE
                });
            return 
        }
        else{
            res.send({
                message:"This is a private account, subscribe to see publications",
                code:STATE_PRIVATE_ACCOUNT
        });
            database.disConnect();
            return 
       }
    }else{
        const posts = await database.query("SELECT * FROM post where userId="+userId+ " LIMIT 6 OFFSET "+p)
        database.disConnect();
        res.send(posts)
        return 
    }

   
  
})

routerMediaPost.post('/', (req, res) => {

    const d = Date.now();
    let img = req.files.myImage
    let comment = req.body.comment

    mysqlConnection.query("INSERT INTO post (userId, comment, date) VALUES  ( "+ req.infoInToken.userId+", '"+comment+"', "+ d+") ", (errPost , rowsPost) => {

        if (errPost){
            res.send({error: errPost});
            return ;
        }
        console.log(rowsPost)

        mysqlConnection.query("SELECT * FROM user WHERE id="+ req.infoInToken.userId, (errorUser, rowsUser) => {
            if (errorUser){
                res.send({error: errorUser});
                return ;
            }
            if(rowsUser.length>0){
                if (img != null) {

                    img.mv('public/images/' + req.infoInToken.userId.toString()+ rowsPost.insertId.toString()  +'.png', 
                        function(err) {
                            if (err) {
                                res.send("Error in upload picture");
                            } else{

                                sharp('public/images/' + req.infoInToken.userId.toString() + rowsPost.insertId.toString()  +'.png')
                                .resize(309,309)
                                .toFile('public/images/' + req.infoInToken.userId.toString()+ rowsPost.insertId.toString()  +'mini.png', (errMini, infoMini) => {
                                    if (errMini) {
                                        console.error(errMini);
                                        res.send("Error in resize picture");
                                    } else {
                                        sharp('public/images/' + req.infoInToken.userId.toString() + rowsPost.insertId.toString()  +'.png')
                                        .resize(1080,1350)
                                        .toFile('public/images/' + req.infoInToken.userId.toString()+ rowsPost.insertId.toString()  +'big.png', (err, info) => {
                                            if (err) {
                                                console.error(err);
                                            } else {
                                                console.log(info);
                                                res.send(rowsPost);
                                            }
                                        })
                                       
                                    }
                                })
                               
                            }
                        }
                    )
                }
    
            }
        })
    })

})


routerMediaPost.delete('/:postId', (req, res) => {
    let postId = req.params.postId

    mysqlConnection.query("DELETE FROM likesforcomments WHERE postId="+postId+"",(errLikesForComments,rowsLikesForComments)=>{
        if (errLikesForComments){
            res.send({error: errLikesForComments});
            return ;
        }
        else{
            mysqlConnection.query("DELETE FROM comment WHERE postId="+postId+"",(errComments,rowsComments)=>{
                if (errComments){
                    res.send({error: errComments});
                    return ;
                }
                else{
                    mysqlConnection.query("DELETE FROM post WHERE id="+postId+"",(err,rows)=>{
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
})

module.exports=routerMediaPost
