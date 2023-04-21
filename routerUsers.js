const express = require('express');
const mysqlConnection = require("./mysqlConnection")
const crypto = require('crypto');
const routerUsers = express.Router();
let keyEncrypt = 'password';
let algorithm = 'aes256'
const objectOfApiKey = require("./objectApiKey")
const jwt = require("jsonwebtoken");
const sharp = require('sharp');

routerUsers.get("/",(req,res,next)=>{


    mysqlConnection.query("SELECT name, surname, phoneNumber, id, email, uniqueName, presentation from user WHERE id="+req.infoInToken.userId+"", (err, rows) => {

        if (err){
            res.send({error:err});
            return 
        } else {
            console.log(rows);
        }

        res.send(rows)
    })
})

routerUsers.put("/",(req,res,next)=>{
    let name = req.body.name
    let surname = req.body.surname
    let phoneNumber = req.body.phoneNumber
    let email = req.body.email
    let uniqueName = req.body.uniqueName
    let presentation = req.body.presentation

    mysqlConnection.query("UPDATE user SET name= '"+name+"', surname='"+surname+"', phoneNumber='"+phoneNumber+"', email='"+email+"', uniqueName='"+uniqueName+"', presentation='"+presentation+"' where id= "+req.infoInToken.userId, (err, rows) => {

        if (err){
            res.send({error:err});
            return 
        } else {                
            res.send({message:"done"});
        }

    })

})
routerUsers.put("/photo",(req,res,next)=>{
    let img = req.files.myImage
    if (img != null) {
        img.mv('public/images/' + req.infoInToken.userId.toString()+'1.png', 
            function(err) {
                if (err) {
                    res.send("Error in upload picture");
                } else{
                    sharp('public/images/' + req.infoInToken.userId.toString()  +'1.png')
                    .resize(309,309)
                    .toFile('public/images/' + req.infoInToken.userId.toString() +'avatar.png', (errMini, infoMini) => {
                        if (errMini) {
                            console.error(errMini);
                            res.send("Error in resize picture");
                        } else {
                            res.send({message:"done"});
                        }
                    })
                    
                }
            }
        )
    }
})
routerUsers.put("/password",(req,res,next)=>{
  
    let password = req.body.password
    let cipher = crypto.createCipher(algorithm, keyEncrypt);
    let passwordEncript = cipher.update(password, 'utf8', 'hex') + cipher.final('hex');
    mysqlConnection.query("UPDATE user SET password='"+passwordEncript+"' where id= "+req.infoInToken.userId, (err, rows) => {

        if (err){
            res.send({error:err});
            return 
        } else {
            res.send({message:"done"});
            console.log(rows);
        }

    })
})
routerUsers.post("/checkPassword",(req,res,next)=>{

    let password = req.body.password
    let cipher = crypto.createCipher(algorithm, keyEncrypt);
    let passwordEncript = cipher.update(password, 'utf8', 'hex') + cipher.final('hex');
    
    mysqlConnection.query("SELECT * FROM user where id='"+req.infoInToken.userId+"' and password='"+passwordEncript+"'", (err, rows) => {
        if (err){
            res.send({error: err});
            return;
        }
        if(rows.length>=1 ){
            res.send({ message:"right"})
        }else{
            res.send({ error:"Error" })
        }
    }
    )
})

module.exports=routerUsers