const express = require('express');
const mysqlConnection = require("./mysqlConnection")
const crypto = require('crypto');
const routerMediaPost = express.Router();
const sharp = require('sharp');
const objectOfApiKey = require("./objectApiKey")
const jwt = require("jsonwebtoken");


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

                    img.mv('public/images/' + req.infoInToken.userId.toString() +req.infoInToken.email + rowsPost.insertId.toString()  +'.png', 
                        function(err) {
                            if (err) {
                                res.send("Error in upload picture");
                            } else{

                                sharp('public/images/' + req.infoInToken.userId.toString() +req.infoInToken.email + rowsPost.insertId.toString()  +'.png')
                                .resize(309,309)
                                .toFile('public/images/' + req.infoInToken.userId.toString() +req.infoInToken.email + rowsPost.insertId.toString()  +'mini.png', (errMini, infoMini) => {
                                    if (errMini) {
                                        console.error(errMini);
                                        res.send("Error in resize picture");
                                    } else {
                                        sharp('public/images/' + req.infoInToken.userId.toString() +req.infoInToken.email + rowsPost.insertId.toString()  +'.png')
                                        .resize(1080,1350)
                                        .toFile('public/images/' + req.infoInToken.userId.toString() +req.infoInToken.email + rowsPost.insertId.toString()  +'big.png', (err, info) => {
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
