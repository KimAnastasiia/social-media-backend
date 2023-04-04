const express = require('express');
const mysqlConnection = require("./mysqlConnection")
const crypto = require('crypto');
const routerMediaPost = express.Router();

routerMediaPost.get("/",(req,res,next)=>{

    let emailUser = req.query.email

    mysqlConnection.query("SELECT name FROM user where email ='"+emailUser+"' ", (err, rows) => {

        if (err){
            res.send({error:err});
            return 
        } else {
            console.log(rows);
        }

        res.send(rows)
    })
})

routerMediaPost.get("/post",(req,res,next)=>{

    mysqlConnection.query("SELECT * FROM post where userId =" + req.infoInToken.userId, (err, rows) => {

        if (err){
            res.send({error:err});
            return 
        } else {
            console.log(rows);
        }

        res.send(rows)
    })
})


routerMediaPost.post('/', (req, res) => {

    let img = req.files.myImage
   
    mysqlConnection.query("INSERT INTO post (userId) VALUES  ( "+ req.infoInToken.userId+" ) ", (errPost , rowsPost) => {

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
                            } 
                        }
                    )
                }
    
            }
        })
    })

})

module.exports=routerMediaPost
