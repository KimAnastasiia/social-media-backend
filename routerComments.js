const express = require('express');
const mysqlConnection = require("./mysqlConnection")
const crypto = require('crypto');
const routerComments = express.Router();
const sharp = require('sharp');
const objectOfApiKey = require("./objectApiKey")
const jwt = require("jsonwebtoken");


routerComments.delete("/:id/:commentId",(req,res)=>{
    let postId = req.params.id
    let id = req.params.commentId
    mysqlConnection.query("DELETE FROM comment WHERE postId="+postId+" and userId="+req.infoInToken.userId+" and id="+id,(err,rows)=>{
        if (err){
            res.send({error: err});
            return ;
        }
        else{
            console.log(rows)
        }
        res.send({messege:"done"})
    }
)})

routerComments.post('/', (req, res) => {

    let postId  = req.body.postId
    let comment  = req.body.comment
    const d = Date.now();
    
    mysqlConnection.query("INSERT INTO comment ( userId, postId, comment, date ) VALUES ("+req.infoInToken.userId+","+postId+",'"+comment+"',"+d+") ", (err, rows) => {

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

})

module.exports=routerComments